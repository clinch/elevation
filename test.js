"use strict";

var Elevator = require('./elevator');
var controllers = require('./controllers');
var Passenger = require('./passenger');
var process = require('process');
var SatisfactionAnalyzer = require('./satisfactionAnalyzer');
var debug = require('debug')('elevation:test');

let elevator = new Elevator();
let controller = new controllers.SerialElevatorController(elevator);
//let controller = new controllers.JustKeepGoingController(elevator);


let done = false;

if (process.argv.length < 3) {
	console.log('Please provide an input file (eg: in1) as an argument');
	console.log('Eg: $ DEBUG=* node test in1');
	process.exit(1);
}

let data = require('./data/' + process.argv[2]);

function* getNextPassenger() {
	for (let i = 0; i < data.length; i++) {
		data[i].id = i;
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
		newPassenger = new Passenger(passengerData.value.origin, elevator, passengerData.value.origin, passengerData.value.direction, passengerData.value.destination);
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

	for (let i = 0; i < passengers.length; i++) {
		SatisfactionAnalyzer.analyze(passengers[i]);
	}

	debug('All passengers have been delivered safely');
	process.exit();
}

let generator = getNextPassenger();
let passengers = [];
generatePassenger();
