var assert = require("assert");
var process = require("process");
var Elevator = require('../elevator');

describe('Elevator', function() {
	// Speed up the elevator for tests.
	var origSpeed = Elevator.SPEED;
	var elevator;

	before(function() {
		Elevator.SPEED = 5;
	});

	beforeEach(function() {
		elevator = new Elevator();
	});

	it('contains directionally valid constants', function() {
		assert.equal(-1, Elevator.DOWN);
		assert.equal(1, Elevator.UP);
		assert.equal(0, Elevator.STOPPED);
	});

	it('starts on the ground floor in idle state', function () {
		assert.equal(0, elevator.getFloor());
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.STOPPED, elevator.getDirection());
		assert.equal(true, elevator.isIdle());
	});

	it('doesn\'t go anywhere when asked to move nowhere', function() {
		elevator.goto(0);
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.STOPPED, elevator.getDirection());
	});

	it('starts moving up when asked', function(done) {
		elevator.on('stop', function(floor, direction) {
			assert.equal(2, elevator.getFloor());
			done();
		});
		elevator.goto(2);
		assert.equal(2, elevator.getDestination());
		assert.equal(Elevator.UP, elevator.getDirection());
	});

	it('emits stop events as it arrives at floors', function() {
		/* Moving to 2 from 0, from previous test. */
		var stopCount = 0;
		elevator.on('stop', function() { stopCount++; });
		var idleCount = 0;
		elevator.on('idle', function() { idleCount++ });

		elevator.goto(2);

		/* Elevator should *not* emit anything until after move 2. */
		elevator.move();
		assert.equal(0, stopCount);
		assert.equal(0, idleCount);

		/* Elevator should emit stop after move 2. */
		elevator.move();
		assert.equal(1, stopCount);
		assert.equal(0, idleCount);

		/* One more move and it should go idle. */
		elevator.move();
		assert.equal(1, stopCount);
		assert.equal(1, idleCount);
	});

	it('moves down when asked', function(done) {
		elevator.once('stop', function(floor, direction) {
			assert.equal(floor, 1);
			assert.equal(elevator.getFloor(), 1);
			assert.equal(elevator.getDirection(), Elevator.STOPPED);
			assert.equal(elevator.getDestination(), undefined);
			assert.equal(direction, undefined);

			elevator.once('load', function(floor, direction) {
				// remains stopped until next tick. Second callback differs in direction only.
				assert.equal(floor, 1);
				assert.equal(elevator.getFloor(), 1);
				assert.equal(elevator.getDestination(), 0);
				assert.equal(elevator.getDirection(), Elevator.STOPPED);
				assert.equal(direction, Elevator.DOWN);
				done();
			});
			elevator.goto(0);
		});
		elevator.goto(1);

	});

	it('forwards requests as events for controllers', function(done) {
		var destination = 123;
		elevator.on('floorRequest', function(arg) {
			assert.equal(destination, arg);
			done();
		});

		elevator.requestFloor(destination);
	});

	it('goto() while stopped changes the stop direction as much as is desired', function(done) {
		elevator.goto(1);
		elevator.move();
		done();
	});

	after(function() {
		Elevator.SPEED = origSpeed;
	});
});
