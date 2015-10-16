"use strict";

var events = require('events');
var debug = require('debug')('Elevator');

/**
 * Elevator
 * @constructor
 */
class Elevator extends events.EventEmitter {
	constructor() {
		super();

		this.setMaxListeners(100);
		this.floor = 0;
		this.destination = 0;
		this.direction = Elevator.STOPPED;
		this.motor = undefined;
	}

	/**
	 * Starts the elevator.
	 *
	 * @private
	 */
	run() {
		if (!this.motor) {
			this.motor = setInterval(this.move.bind(this), Elevator.SPEED);
		}
	}

	/**
	 * Stops the elevator by disbling the motor.
	 *
	 * @private
	 */
	idle() {
		if (this.motor) {
			clearInterval(this.motor);
			this.motor = undefined;
			this.emit('idle');
		}
	}

	/**
	 * getFloor
	 *
	 * @return {integer} The floor that the elevator is currently positioned at.
	 */
	getFloor() {
		return this.floor;
	}

	/**
	 * getDirection
	 *
	 * @return {integer} The direction that this elevator is currently travelling.
	 */
	getDirection() {
		return this.direction;
	}

	/**
	 * getDestination
	 *
	 * @return {integer} The towards which this elevator will travel.
	 */
	getDestination() {
		return this.destination;
	}

	/**
	 * Determine if the elevator is idle.
	 *
	 * @return {boolean}
	 */
	isIdle() {
		return !Boolean(this.motor);
	}

	/**
	 * Sends the elevator to a given floor, specified as a parameter.
	 *
	 * @param {integer} The destination floor number to which the elevator should travel.
	 */
	goto(destination) {
		debug('Setting destination to floor %d', destination);

		this.destination = destination;

		if (this.direction === Elevator.STOPPED) {
			if (this.floor < this.destination) {
				this.emit('load', this.floor, Elevator.UP);
			} else if (this.floor > this.destination) {
				this.emit('load', this.floor, Elevator.DOWN);
			}
		}

		if (this.isIdle()) {
			this.move();
		}
	}

	/**
	 * Move one floor on every interval, determined by Elevator.SPEED.
	 *
	 * @private
	 */
	move() {
		this.floor += this.direction;

		if (this.direction !== Elevator.STOPPED) {
			this.emit('move', this.floor, this.direction);
		}

		if (this.floor < this.destination) {
			this.direction = Elevator.UP;
		} else if (this.floor > this.destination) {
			this.direction = Elevator.DOWN;
		} else {
			if (this.direction === Elevator.STOPPED) {
				// We've been stopped for a cycle. We're now idle.
				debug('Idle at floor %d.', this.floor);
				this.idle();
			} else {
				this.direction = Elevator.STOPPED;
				this.destination = undefined;
				debug('Arrived at floor %d. Stopping.', this.floor);
				this.emit('stop', this.floor); // Don't know where the controller will send us next.
			}
		}

		if (this.direction !== Elevator.STOPPED && this.isIdle()) {
			this.run();
		}
	}


	/**
	 * Make a request for a particular floor.
	 *
	 * @param {Number} destination The destination floor.
	 */
	requestFloor(floor, direction) {
		this.emit('floorRequest', floor, direction);
	}
}

/**
 * Elevator direction constants.
 */
Elevator.UP = 1;
Elevator.DOWN = -1;
Elevator.STOPPED = 0;

/**
 * Speed of elevator actions, in milliseconds.
 */
Elevator.SPEED = 1000;

module.exports = Elevator;
