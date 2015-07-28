var Elevator = require('./elevator.js');

/**
 * Simple Serial Elevator Controller - handle one request at a time.
 */
function SerialElevatorController(elevator) {
	this.fifo = [];
	this.elevator = elevator;

	/* On floor request, queue and try to move the elevator. */
	elevator.on('request', (function(destination) {
		this.fifo.push(destination);
		this.next();
	}).bind(this));

	/* On arrival at a floor (idle), try to move the elevator. */
	elevator.on('idle', (function(destination) {
		this.next();
	}).bind(this));
}

SerialElevatorController.prototype = {
	/**
	 * Handle the next request in the FIFO queue.
	 */
	next: function() {
		/* No requests in the queue, so nowhere to go. */
		if (!this.fifo.length) {
			return;
		}

		/* This simple controller doesn't change direction when moving. */
		if (this.elevator.getDirection() !== Elevator.IDLE) {
			return;
		}

		this.elevator.goto(this.fifo.shift());
	}
};

exports.SerialElevatorController = SerialElevatorController;
