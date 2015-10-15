var assert = require("assert")
var Elevator = require('../elevator');

describe('Elevator', function() {

	it('contains directionally valid constants', function() {
		assert.equal(-1, Elevator.DOWN);
		assert.equal(1, Elevator.UP);
		assert.equal(0, Elevator.STOPPED);
	});

	var elevator = new Elevator();
	it('starts on the ground floor in idle state', function () {
		assert.equal(0, elevator.getFloor());
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.STOPPED, elevator.getDirection());
	});

	it('doesn\'t go anywhere when asked to move nowhere', function() {
		elevator.goto(0);
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.STOPPED, elevator.getDirection());
	});

	it('starts moving up when asked', function() {
		elevator.goto(2);
		assert.equal(2, elevator.getDestination());
		assert.equal(Elevator.UP, elevator.getDirection());

	});

	// Pending because move events are no longer emitted.
	it('emits movement events as it moves');

	// Pending because direction is not changed until next timer tick.
	it('moves down when asked');

	it('forwards requests as events for controllers', function(done) {
		var destination = 123;
		elevator.on('floorRequest', (arg) => {
			assert.equal(destination, arg);
            done();
		});

		elevator.requestFloor(destination);
	});
});
