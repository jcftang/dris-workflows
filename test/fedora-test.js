var assert = require('assert');
var fedora = require('../lib/fedora');

module.exports = {
	'test1 GetFedoraList': function(beforeExit, assert) {
		xml = fedora.getFedoraList();
		assert.isNotNull(xml);
	},
	'test2 GetFedoraItem': function(beforeExit, assert) {
		xml = fedora.getFedoraObject();
		assert.isNotNull(xml);
	},
	'test3 CreateFedoraItem': function(beforeExit, assert) {
		result = fedora.createFedoraObject();
		console.log(result);
		assert.isNotNull(result);
	}
};
// uuid
//mocha, connect
