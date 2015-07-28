var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Elevator
 * @constructor
 */
function Elevator() {
	this.floor = 0;
	this.destination = 0;
	this.direction = Elevator.IDLE;
	this.motor = setInterval(this.move.bind(this), Elevator.SPEED);
}
util.inherits(Elevator, EventEmitter);

/**
 * Elevator direction constants.
 */
Elevator.UP = 1;
Elevator.DOWN = -1;
Elevator.IDLE = 0;

/**
 * Speed of elevator actions, in milliseconds.
 */
Elevator.SPEED = 1000;

/**
 * getFloor
 *
 * @return: 	The floor that the elevator is currently positioned at.
 */
Elevator.prototype.getFloor = function() {
	return this.floor;
};

/**
 * getDirection
 *
 * @return: 	The direction that this elevator is currently travelling.
 */
Elevator.prototype.getDirection = function() {
	return this.direction;
};

/**
 * getDestination
 *
 * @return: 	The last floor (destination) that was requested for this elevator
 */
Elevator.prototype.getDestination = function() {
	return this.destination;
};

/**
 * goto
 * Sends the elevator to a given floor, specified as a parameter.
 *
 * @return: 	Send the elevator to a floor number
 */
Elevator.prototype.goto = function(destination) {
	this.destination = destination;

	console.log('Moving to floor %d', destination);

	if (this.floor < destination) {
		this.direction = Elevator.UP;
	} else if (this.floor > destination) {
		this.direction = Elevator.DOWN;
	} else {
		this.direction = Elevator.IDLE;
		console.log('Already on floor %d', destination);
	}
};

/**
 * Move one floor on every interval, determined by Elevator.SPEED.
 *
 * @private
 */
Elevator.prototype.move = function() {
	if (this.direction == Elevator.IDLE) return;

	this.floor += this.direction;

	if (this.floor == this.destination) {
		this.direction = Elevator.IDLE;
		this.emit('idle', this.floor);
		console.log('Arrived at floor %d', this.floor);
	} else {
		this.emit('move', this.floor, this.direction);
		console.log('Moving. New floor: %d', this.floor);
	}
};

/**
 * Make a request for a particular floor.
 *
 * @param {Number} destination The destination floor.
 */
Elevator.prototype.request = function(destination) {
	console.log('Request for floor %d', destination);
	this.emit('request', destination);
}

module.exports = Elevator;