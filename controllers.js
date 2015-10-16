"use strict";

var Elevator = require('./elevator.js');
var debug = require('debug')('Controller');

/**
 * Elevator controllers should extend this abstract class.
 */
class AbstractElevatorController {
	constructor(elevator) {
		this.elevator = elevator;
	}

	requestFloor(floor, direction) {
		throw new Error("Abstract method requestFloor not implemented");
	}
}

/**
 * Simple Serial Elevator Controller - handle one request at a time.
 */
class SerialElevatorController extends AbstractElevatorController {
	constructor (elevator) {
		super(elevator);

		this.fifo = [];

		/* On floor request, queue and try to move the elevator. */
		elevator.on('floorRequest', (floor, direction) => {
			debug('New elevator request. %d, %d', floor, direction);
			this.fifo.push(floor);

			debug(this.fifo);
			if (this.elevator.getDirection() === Elevator.STOPPED) {
				this.next();
			}
		});

		/* On arrival at a floor (stop), try to move the elevator. */
		elevator.on('stop', (floor, direction) => {
			if (!direction) {
				this.next();
			}
		});

		/* If there are no more move requests, the elevator is idle. */
		elevator.on('idle', (floor, direction) => {
			// Time for a beer.
		});
	}

	/**
	 * Handle the next request in the FIFO queue.
	 */
	next() {
		/* No requests in the queue, so nowhere to go. */
		if (!this.fifo.length) {
			debug('No more requests in the queue');
			return;
		}

		/* This simple controller doesn't change direction when moving. */
		if (this.elevator.getDirection() !== Elevator.STOPPED) {
			return;
		}

		this.elevator.goto(this.fifo.shift());
	}
}

/**
 * Just keep going in the same direction as you're currently going.
 */
class JustKeepGoingController extends AbstractElevatorController {
	constructor(elevator) {
		super(elevator);

		this.lastDirection = elevator.getDirection();
		this.requests = [];

		elevator.on('floorRequest', (floor, direction) => {
			this.requests.push({ floor: floor, direction: direction });
			this.onStop(floor);
		});

		elevator.on('stop', (floor, direction) => { this.onStop(floor, direction); });
	}

	/**
	 * Allow passengers to disembark and embark.
	 *
	 * Removes any requests that have been handled:
	 *  - passengers that are disembarking (request for this floor and no direction)
	 *  - passengers that are embarking (request for this floor in the correct direction)
	 */
	unloadLoad(floor, direction) {
		this.requests = this.requests.filter((request) => {
			/* Keep requests for other floors. */
			if (request.floor != floor) {
				return true; // keep all requests not for this floor.
			}

			/* Keep requests for the other direction. */
			if (request.direction && request.direction !== direction) {
				return true;
			}

			/* Requests for this floor with either no direction or this direction are handled. */
			return false;
		});
	}

	/**
	 * Get a list of outstanding requests that are in a given direction.
	 */
	getDirectionalRequests(floor, direction) {
		return this.requests.filter((request) => {
			/* Drop if it's for the wrong direction. */
			if (request.direction && request.direction != direction) {
				return false;
			}

			/* Drop if the floor is in the wrong direction. */
			if (request.floor > floor) {
				return direction === Elevator.UP;
			} else if (request.floor < floor) {
				return direction === Elevator.DOWN;
			}
			return false; /* no direction, and we're at their floor. They're getting out. */
		});
	}

	/**
	 * Get the furthest request that lies in a given direction for elevator turnaround.
	 */
	getFurthestRequest(floor, direction) {
		return this.requests.reduce((furthestRequest, request) => {
			if (request.floor > floor && direction === Elevator.UP) {
				if (!furthestRequest) {
					return request;
				}
				return (furthestRequest.floor > request.floor) ? furthestRequest : request;
			} else if (request.floor < floor && direction === Elevator.DOWN) {
				if (!furthestRequest) {
					return request;
				}
				return (furthestRequest.floor < request.floor) ? furthestRequest : request;
			}
			return furthestRequest;
		}, null);
	}

	onStop(floor, direction) {
		this.unloadLoad(floor);

		debug(this.requests);

		if (this.requests.length <= 0) {
			return; // no requests. go idle.
		}

		direction = this.getSaneDirection(direction);

		/* Get a list of requests in the current direction. */
		var requests = this.getDirectionalRequests(floor, direction);

		/* No more to service in this direction, find the most extreme request in this direction for turnaround. */
		if (requests.length <= 0) {
			var furthest = this.getFurthestRequest(floor, direction);
			if (furthest) {
				this.elevator.goto(furthest.floor);
				return;
			}
		}

		/* If there are no further requests in the current direction, go the other way. */
		direction = this.getOppositeDirection(direction);
		requests = this.getDirectionalRequests(floor, this.getOppositeDirection(direction));

		/* If there are still no requests, just use the whole pool. */
		if (requests.length <= 0) {
			requests = this.requests;
		}

		/* Find the request with the closest floor. */
		var request = requests.reduce((closestRequest, request) => {
			if (!closestRequest) {
				return request;
			}

			if (Math.abs(floor - request.floor) < Math.abs(floor - closestRequest.floor)) {
				return request;
			}
			return closestRequest;
		}, null);

		if (request) {
			this.elevator.goto(request.floor);
		}
	}

	getOppositeDirection(direction) {
		if (direction === Elevator.DOWN) {
			return Elevator.UP;
		}
		return Elevator.DOWN;
	}

	/**
	 * Get a direction of travel, preferring a direction, the last direction, or a default.
	 *
	 * @returns {integer}
	 */
	getSaneDirection(direction) {
		if (direction === Elevator.UP || direction === Elevator.DOWN) {
			this.lastDirection = direction;
			return direction;
		} else if (this.lastDirection === Elevator.UP || this.lastDirection === Elevator.DOWN) {
			return this.lastDirection;
		}
		return Elevator.UP; // whatever. Just not stopped.
	}
}


exports.SerialElevatorController = SerialElevatorController;
exports.JustKeepGoingController = JustKeepGoingController;
