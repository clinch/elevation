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

		this.floor = 0;
		this.destination = 0;
		this.direction = Elevator.STOPPED;
		this.motor = setInterval(this.move.bind(this), Elevator.SPEED);
	}

	/**
	 * getFloor
	 *
	 * @return The floor that the elevator is currently positioned at.
	 */
	getFloor() {
		return this.floor;
	};

	/**
	 * getDirection
	 *
	 * @return The direction that this elevator is currently travelling.
	 */
	getDirection() {
		return this.direction;
	};

	/**
	 * getDestination
	 *
	 * @return The last floor (destination) that was requested for this elevator
	 */
	getDestination() {
		return this.destination;
	};

	/**
	 * Sends the elevator to a given floor, specified as a parameter.
	 *
	 * @return Send the elevator to a floor number
	 */
	goto(destination) {
		this.destination = destination;

		debug('Moving to floor %d', destination);

		if (this.floor < destination) {
			this.direction = Elevator.UP;
		} else if (this.floor > destination) {
			this.direction = Elevator.DOWN;
		} else {
			this.direction = Elevator.STOPPED;
			debug('Already on floor %d', destination);
		}
	};

	/**
	 * Move one floor on every interval, determined by Elevator.SPEED.
	 *
	 * @private
	 */
	move() {
		if (this.direction == Elevator.STOPPED) {
			return;
		}

		this.floor += this.direction;

		if (this.floor == this.destination) {
			this.direction = Elevator.STOPPED;
			this.emit('stop', this.floor);
			debug('Arrived at floor %d', this.floor);
		} else {
			this.emit('move', this.floor, this.direction);
			debug('Moving. New floor: %d', this.floor);
		}
	};


	/**
	 * Make a request for a particular floor.
	 *
	 * @param {Number} destination The destination floor.
	 */
	requestFloor(floor, direction) {
		debug('Request for floor %d, direction %d', floor, direction);
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
