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
		this.activeRequest = null;

		/* On floor request, queue and try to move the elevator. */
		elevator.on('floorRequest', (floor, direction) => {
			debug('New elevator request. floor %d, direction %d', floor, direction);
			var request = { floor: floor, direction: direction };
			if (!direction) {
				/* Requests from passengers are handled immediately. */
				this.fifo.unshift(request);
			} else {
				/* Requests from passengers waiting on floors are queued. */
				this.fifo.push(request);
			}
			this.next();
		});

		/* On arrival at a floor (stop), try to move the elevator. */
		elevator.on('stop', (floor) => {
			this.activeRequest = null;
			this.unload(floor);
			this.next();
		});

		elevator.on('load', (floor, direction) => {
			this.load(floor, direction);
		});

		/* If there are no more move requests, the elevator is idle. */
		elevator.on('idle', (floor, direction) => {
			this.next();
		});
	}

	/**
	 * Let passengers off the elevator.
	 *
	 * Removes requests from the fifo queue with matching floor and no direction.
	 */
	unload(floor) {
		this.fifo = this.fifo.filter((request) => {
			if (!request.direction && request.floor === floor) {

				return false; // false tells filter to remove the entry.
			}
			return true;
		});
	}

	/**
	 * Let passengers on the elevator.
	 *
	 * Removes requests from the fifo queue with matching floor and direction.
	 */
	load(floor, direction) {
		this.fifo = this.fifo.filter((request) => {
			if (request.direction === direction && request.floor === floor) {
				return false; // false causes filter to remove the entry.
			}
			return true;
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

		/* Can only do one thing at once. */
		if (this.activeRequest) {
			//debug("Already have a move");
			return;
		}

		/* This simple controller doesn't change direction when moving. */
		if (this.elevator.getDirection() !== Elevator.STOPPED) {
			//debug("Elevator not stopped");
			return;
		}

		/* Handle floorless requests immedaitely. */
		var request = this.fifo.shift();

		if (this.elevator.getFloor() !== request.floor) {
			debug('Moving elevator to floor %d', request.floor);
			this.activeRequest = request;
			this.elevator.goto(request.floor);
		} else {
			this.next();
		}
	}
}

exports.SerialElevatorController = SerialElevatorController;
