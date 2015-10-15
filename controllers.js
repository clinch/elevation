"use strict";

var Elevator = require('./elevator.js');
var debug = require('debug')('SerialElevatorController');

/**
 * Simple Serial Elevator Controller - handle one request at a time.
 */
class SerialElevatorController {
	constructor (elevator) {
		this.fifo = [];
		this.elevator = elevator;

		/* On floor request, queue and try to move the elevator. */
		elevator.on('request', (destination) => {
			debug('New elevator request');
			this.fifo.push(destination);
			this.next();
		});

		/* On arrival at a floor (idle), try to move the elevator. */
		elevator.on('idle', (destination) => {
			this.next();
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
		if (this.elevator.getDirection() !== Elevator.IDLE) {
			return;
		}

		this.elevator.goto(this.fifo.shift());
	}

}


exports.SerialElevatorController = SerialElevatorController;
