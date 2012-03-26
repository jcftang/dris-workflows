var app = require('../app'),
    assert = require('assert');

module.exports = {
	'GET /home': function(done, assert){
		assert.response(app,
		{ url: '/home' },
		{ status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
		function(res){
		assert.includes(res.body, '<title>DRIS Workflows</title>');

		done();
		});
	},

	'GET /all': function(done, assert){
		assert.response(app,
		{ url: '/all' },
		{ status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
		function(res){
		assert.includes(res.body, '<title>All</title>');

		done();
		});
	}
}
