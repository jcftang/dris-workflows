
var assert = require('assert');
var data = require('../admin');

module.exports = {
	'test String#length': function(beforeExit, assert) {
		assert.equal(6, 'foobar'.length);
	},
	
	'test2 String#length': function(beforeExit, assert) {
		data.getItems();
		assert.equal(6, 'foobar'.length);
	}
};
