"use strict";

var Elevator = require ('./elevator');
var controllers = require('./controllers');
var Passenger = require('./passenger');
var debug = require('debug')('elevation:test');

let elevator = new Elevator();
let controller = new controllers.SerialElevatorController(elevator);

let data = [
	{ delay:  7, origin:  5, direction: Elevator.UP, destination: 6 }, /* Move from 5 to 6. Then pause for 7 secs */
	{ delay:  3, origin:  3, direction: Elevator.UP, destination: 6 }, /* Move from 3 to 6. Then pause for 3 secs */
	{ delay: 4, origin:  12, direction: Elevator.DOWN, destination: 1 }, /* etc, ... */
	{ delay: 5, origin:  7, direction: Elevator.DOWN, destination: 2  }
];

function* getNextPassenger() {
	for (let i = 0; i < data.length; i++) {
		yield data[i];
	}
}

function generatePassenger() {
	let passengerData = generator.next();
	let newPassenger;

	if (passengerData.done) {
		// Wait till elevator is done everything, then analyze 
	} else {
		debug('Creating new passenger. Going from %d to %d', passengerData.value.origin, passengerData.value.destination);
		newPassenger = new Passenger(elevator, passengerData.value.origin, passengerData.value.direction, passengerData.value.destination);
		passengers.push(newPassenger);

		setInterval(generatePassenger, passengerData.value.delay * 1000);
	}
}

let generator = getNextPassenger();
let passengers = [];
generatePassenger();
