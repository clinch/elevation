"use strict";


var Elevator = require('./Elevator');
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

		init();
	}

	/**
	 * Starts this passenger's trip.
	 * @return {[type]} [description]
	 */
	init() {
		this.elevator.on('stop', (floor, direction) => {
			if (this.origin === floor && (direction == undefined || this.direction === direction) {
				this.boardElevator();
			}
		});		

		requestElevator();
	}

	/**
	 * Request the elevator to come to this Passenger's origin.
	 */
	requestElevator() {
		
	}

	/**
	 * Passenger boards the elevator and then issues a new request to go to destination
	 */
	boardElevator() {

	}



}


module.exports = Passenger;