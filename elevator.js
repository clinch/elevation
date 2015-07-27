
var SPEED = 2000;


/**
 * Elevator
 * @constructor
 */
function Elevator() {
	this.floor = 0;
	this.destination = 0;

	// Directions that we can travel
	this.UP = 1;
	this.DOWN = -1;
	this.IDLE = 0;

	this.direction = this.IDLE;

	this.motor = setInterval(this.move, SPEED, this);
}

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

	console.log('Request to move to floor %d', destination);

	if (this.floor < destination) {
		this.direction = this.UP;
	} else if (this.floor > destination) {
		this.direction = this.DOWN;
	} else {
		this.direction = this.IDLE;
		console.log('Already on floor %d', destination);
	}
};

Elevator.prototype.move = function(elevator) {
	if (elevator.direction == elevator.IDLE) return;

	elevator.floor += elevator.direction;

	if (elevator.floor == elevator.destination) {
		elevator.direction = elevator.IDLE;
		console.log('Arrived at floor %d', elevator.floor);
	} else {
		console.log('Moving. New floor: %d', elevator.floor);		
	}

};


module.exports = Elevator;