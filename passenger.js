"use strict";


var Elevator = require('./elevator');
var events = require('events');
var process = require('process');
var debug = require('debug')('Passenger');

/**
 * Passenger
 */
class Passenger extends events.EventEmitter {

	constructor(id, elevator, origin, direction, destination) {
		super();

		this.id = id;
		this.elevator = elevator;
		this.origin = origin;
		this.direction = direction;
		this.destination = destination;
		this.satisfaction = 100;

		this.state = Passenger.WAITING;

		this.waitTimes = [];
		this.actionTimes = [];

		this.cf = this.checkFloor.bind(this);

		this.init();
	}

	/**
	 * Starts this passenger's trip.
	 * @return {[type]} [description]
	 */
	init() {
		this.elevator.on('stop', this.cf);		
		this.elevator.on('load', this.cf);

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
		this.noteTime();
		this.elevator.requestFloor(this.origin, this.direction);
	}

	/**
	 * Passenger boards the elevator and then issues a new request to go to destination
	 */
	getOnElevator() {
		this.noteTime();
		debug('%d getting on floor %d', this.id, this.origin);
		this.state = Passenger.TRAVELLING;
		this.emit('embark');
		this.elevator.requestFloor(this.destination, null);
	}

	/**
	 * Passenger gets off the elevator and is now complete.
	 */
	getOffElevator() {
		this.noteTime();
		debug('%d getting off floor %d', this.id, this.destination);
		
		this.elevator.removeListener('stop', this.cf);
		this.elevator.removeListener('load', this.cf);

		this.state = Passenger.DONE;
		
		debug('Wait time: %d . %d', this.waitTimes[0][0], this.waitTimes[0][1]);
		debug('Travel time: %d . %d', this.waitTimes[1][0], this.waitTimes[1][1]);

		this.emit('disembark');
	}

	/**
	 * Keeps track of the times that the elevator is taking to do its thing.
	 */
	noteTime() {
		if (this.actionTimes.length > 0) {
			this.waitTimes.push(process.hrtime(this.actionTimes[this.actionTimes.length - 1]));
		}
		this.actionTimes.push(process.hrtime());		
	}
}

Passenger.WAITING = 0;
Passenger.TRAVELLING = 1;
Passenger.DONE = 2;

module.exports = Passenger;