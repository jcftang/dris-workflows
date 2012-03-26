
var assert = require('assert');
var data = require('../data');

module.exports = {
	'getSeries': function(done) {
		var series = data.getAllSeries();
		assert.isNotNull(series);

		done();
	}
};
