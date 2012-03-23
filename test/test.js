var vows = require('vows')
	, assert = require('assert');
	//, data = require('../data');

vows.describe('Self Test').addBatch({
	'say that we are ok': {
		topic: function()
			{ return 'ok' },

	'we say': function(topic)
		{ assert.equal(topic, 'ok'); }
	}
}).run();
