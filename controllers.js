"use strict";

var Elevator = require('./elevator.js');
var debug = require('debug')('SerialElevatorController');

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
			this.next();
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


exports.SerialElevatorController = SerialElevatorController;
