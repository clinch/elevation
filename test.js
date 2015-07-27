
var Elevator = require ('./elevator');

var elevator = new Elevator();

elevator.goto(5);


setTimeout(function(elevator) {
	elevator.goto(3);
}, 7000, elevator);

setTimeout(function(elevator) {
	elevator.goto(12);
}, 10000, elevator);