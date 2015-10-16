var Elevator = require('../elevator');

var data = [
	{ delay:  7, origin:  5, direction: Elevator.UP, destination: 6 }, 	// Passenger on floor 5 requests floor 6. Then 7 sec delay
	{ delay:  3, origin:  3, direction: Elevator.UP, destination: 6 },	// Passenger on floor 3 requests floor 6. Then 3 sec delay
	{ delay: 4, origin:  12, direction: Elevator.DOWN, destination: 1 },	// etc.
	{ delay: 0, origin:  7, direction: Elevator.DOWN, destination: 2  }
];

module.exports = data;