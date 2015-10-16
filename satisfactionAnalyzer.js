"use strict";

var Passenger = require('./passenger');
var debug = require('debug')('SatisfactionAnalyzer');

class SatisfactionAnalyzer {
	constructor ()  {
		throw Error('You should not instatiate this');
	}
	static analyze(passenger) {
		debug(`Wouldn't it be nice to know what made people happy?`);
		debug(`Wait time (${passenger.waitTimes[0][0]}) Travel time (${passenger.waitTimes[1][0]}) Movements (${passenger.travelMovements.length})`);
	}

}

module.exports = SatisfactionAnalyzer;