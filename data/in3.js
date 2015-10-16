var Elevator = require('../elevator');

var data = [
	{ delay: 1, origin:  1, direction: Elevator.UP, destination: 6 }, 	
	{ delay: 0.5, origin:  8, direction: Elevator.UP, destination: 12 },	
	{ delay: 0.3, origin:  12, direction: Elevator.DOWN, destination: 1 },
	{ delay: 1, origin:  7, direction: Elevator.DOWN, destination: 2  },
	{ delay: 1, origin:  15, direction: Elevator.UP, destination: 16 }, 	
	{ delay: 0.1, origin:  3, direction: Elevator.UP, destination: 9 },	
	{ delay: 0.1, origin:  1, direction: Elevator.DOWN, destination: 4 },	// Wildcard
	{ delay: 1, origin:  7, direction: Elevator.DOWN, destination: 2  },
	{ delay: 0.2, origin:  1, direction: Elevator.UP, destination: 6 }, 	
	{ delay: 0.5, origin:  1, direction: Elevator.UP, destination: 6 },	
	{ delay: 0.3, origin:  2, direction: Elevator.DOWN, destination: 1 },
	{ delay: 1, origin:  3, direction: Elevator.DOWN, destination: 2  },
	{ delay: 1, origin:  15, direction: Elevator.UP, destination: 6 },		// Wildcard 	
	{ delay: 0.5, origin: 13, direction: Elevator.UP, destination: 15 },	
	{ delay: 0.3, origin:  12, direction: Elevator.DOWN, destination: 1 },
	{ delay: 1, origin:  10, direction: Elevator.DOWN, destination: 2  },
	{ delay: 1, origin:  11, direction: Elevator.UP, destination: 12 }, 	
	{ delay: 0.5, origin:  10, direction: Elevator.UP, destination: 11 },	
	{ delay: 0.3, origin:  11, direction: Elevator.DOWN, destination: 10 },
	{ delay: 1, origin:  10, direction: Elevator.DOWN, destination: 11  },	// Wildcard
	{ delay: 1, origin:  11, direction: Elevator.UP, destination: 15 }, 	
	{ delay: 0.5, origin:  10, direction: Elevator.UP, destination: 12 },	
	{ delay: 0.1, origin:  11, direction: Elevator.DOWN, destination: 2 },
	{ delay: 0, origin:  1, direction: Elevator.UP, destination: 2  }		
];

module.exports = data;