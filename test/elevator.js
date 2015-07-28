var assert = require("assert")
var Elevator = require('../elevator');

describe('Elevator', function() {
	var elevator = new Elevator();
	it('starts on the ground floor in idle state', function () {
		assert.equal(0, elevator.getFloor());
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.IDLE, elevator.getDirection());
	});

	it('doesn\'t go anywhere when asked to move nowhere', function() {
		elevator.goto(0);
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.IDLE, elevator.getDirection());
	});

	it('starts moving up when asked', function() {
		elevator.goto(2);
		assert.equal(2, elevator.getDestination());
		assert.equal(Elevator.UP, elevator.getDirection());

	});

	it('emits movement events as it moves', function() {
		/* Moving to 2 from 0, from previous test. */
		var moveCount = 0;
		elevator.on('move', function() { moveCount++; });
		var idleCount = 0;
		elevator.on('idle', function() { idleCount++ });

		elevator.move();
		elevator.move();

		assert.equal(1, moveCount); /* Moves past floor 1 */
		assert.equal(1, idleCount); /* Goes idle at floor 2 */

		elevator.removeAllListeners();
	});

	it('moves down when asked', function() {
		elevator.goto(0);
		assert.equal(0, elevator.getDestination());
		assert.equal(Elevator.DOWN, elevator.getDirection());
	});

	it('forwards requests as events for controllers', function(done) {
		var destination = 123;
		elevator.on('request', function(arg) {
			assert.equal(destination, arg);
            done();
		});

		elevator.request(destination);
	});
});
