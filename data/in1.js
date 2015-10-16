var Elevator = require('../elevator');

var data = [
	{ delay:  5, origin:  10, direction: Elevator.UP, destination: 1 },	// Passenger on floor 10 requests floor 1. Then 5 sec delay
	{ delay:  0, origin:  1, direction: Elevator.UP, destination: 10 }	// Passenger on floor 1 requests floor 10.
];

module.exports = data;