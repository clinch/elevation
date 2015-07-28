
var Elevator = require ('./elevator');
var controllers = require('./controllers');

var elevator = new Elevator();
var controller = new controllers.SerialElevatorController(elevator);

/* Track requested floors. */
var requests = [];

/**
 * Send a request for a floor, and track it.
 *
 * @param {Number} destination
 */
function request(destination) {
	requests.push(destination);
	elevator.request(destination);
}

/* When an elevator reaches a floor, all the requests for that floor have been "handled" */
elevator.on('idle', function(floor) {
	requests = requests.filter(function(dest) {
		return dest !== floor;
	});
});

var data = [
	{ delay:  0, floor:  5 }, /* At 0 seconds, move to floor 5. */
	{ delay:  7, floor:  3 }, /* At 7 seconds, move to floor 3. */
	{ delay: 10, floor: 12 }, /* etc, ... */
	{ delay: 11, floor:  0 }
];

for (var i = 0; i < data.length; i++) {
	setTimeout((function(floor) {
		return function() { request(floor); };
	})(data[i].floor), data[i].delay * 1000);
}