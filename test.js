"use strict";

var Elevator = require ('./elevator');
var controllers = require('./controllers');
var Passenger = require('./passenger');
var process = require('process');
var debug = require('debug')('elevation:test');

let elevator = new Elevator();
let controller = new controllers.SerialElevatorController(elevator);

let done = false;

let data = [
	{ delay:  7, origin:  5, direction: Elevator.UP, destination: 6 }, // Move from 5 to 6. Then pause for 7 secs 
	{ delay:  3, origin:  3, direction: Elevator.UP, destination: 6 }, // Move from 3 to 6. Then pause for 3 secs 
	{ delay: 4, origin:  12, direction: Elevator.DOWN, destination: 1 }, // etc, ... 
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
		done = true;
		setInterval(checkForDone, 1000); 
	} else {
		debug('Creating new passenger. Going from %d to %d', passengerData.value.origin, passengerData.value.destination);
		newPassenger = new Passenger(elevator, passengerData.value.origin, passengerData.value.direction, passengerData.value.destination);
		newPassenger.on('disembark', checkForDone);

		passengers.push(newPassenger);

		setTimeout(generatePassenger, passengerData.value.delay * 1000);
	}
}

function checkForDone() {
	if (!done) {
		return;
	}

	for (let i = 0; i < passengers.length; i++) {
		if (Passenger.DONE !== passengers[i].getState()) {
			return;
		}
	}

	debug('All passengers have been delivered safely');
	process.exit();
}

let generator = getNextPassenger();
let passengers = [];
generatePassenger();
