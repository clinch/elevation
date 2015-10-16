"use strict";

var assert = require("assert");
var process = require("process");
var Elevator = require('../elevator');
var Passenger = require('../passenger');

describe('Passenger', function() {

	let elevator;
	let passenger;

	before(function() {
		elevator = new Elevator();
	});

	beforeEach(function() {
		passenger = new Passenger(1, elevator, 1, Elevator.UP, 2);
	});

	it('initializes properly', function() {
		assert.notEqual(undefined, passenger);
		assert.notStrictEqual(null, passenger);
	});

	it('has a satisfaction level of 100 upon creation', function() {
		assert.equal(100, passenger.satisfaction);
	});

	it('has a state of WAITING immediately after creation', function() {
		assert.strictEqual(Passenger.WAITING, passenger.getState());
	})

});