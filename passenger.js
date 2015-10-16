"use strict";


var Elevator = require('./elevator');
var events = require('events');
var debug = require('debug')('Passenger');

/**
 * Passenger
 */
class Passenger extends events.EventEmitter {

	constructor(elevator, origin, direction, destination) {
		super();

		this.elevator = elevator;
		this.origin = origin;
		this.direction = direction;
		this.destination = destination;
		this.satisfaction = 100;

		this.state = Passenger.WAITING;

		this.init();
	}

	/**
	 * Starts this passenger's trip.
	 * @return {[type]} [description]
	 */
	init() {
		this.elevator.on('stop', this.checkFloor.bind(this));		

		this.requestElevator();
	}

	/**
	 * @return {[int]} The current state of this passenger.
	 */
	getState() {
		return this.state;
	}

	/**
	 * Checks at every stop of the elevator to see if we should be doing something
	 * @param  {number} floor       The floor where the elevator is
	 * @param  {number} direction 	The direction the elevator is heading
	 */
	checkFloor(floor, direction) {
		if (Passenger.WAITING === this.state) {
			if (this.origin === floor && (direction == undefined || this.direction === direction)) {
				this.getOnElevator();
			}
		} else if (Passenger.TRAVELLING === this.state) {
			if (this.destination === floor) {
				this.getOffElevator();
			}
		}
	}

	/**
	 * Request the elevator to come to this Passenger's origin.
	 */
	requestElevator() {
		this.elevator.requestFloor(this.origin, this.direction);
	}

	/**
	 * Passenger boards the elevator and then issues a new request to go to destination
	 */
	getOnElevator() {
		debug('Getting on floor %d', this.origin);
		this.state = Passenger.TRAVELLING;
		this.emit('embark');
		this.elevator.requestFloor(this.destination, null);
	}

	/**
	 * Passenger gets off the elevator and is now complete.
	 */
	getOffElevator() {
		debug('Getting off floor %d', this.destination);
		this.elevator.removeListener('stop', this.checkFloor);
		this.state = Passenger.DONE;
		this.emit('disembark');
	}
}

Passenger.WAITING = 0;
Passenger.TRAVELLING = 1;
Passenger.DONE = 2;

module.exports = Passenger;