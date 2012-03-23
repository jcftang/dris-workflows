var assert = require('assert');
var data = require('../data');

module.exports = {
	'getSeries': function() {
		var series = data.getAllSeries2();
		assert.isNotNull(series);
		//assert.eql(2,3);
		//
	}
};
