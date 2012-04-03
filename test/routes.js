var assert = require('chai').assert;
var app = require('../app');
process.env.NODE_ENV = 'test';

module.exports = {
	'GET /home' : function() {
		assert.ok(app, {
			url : '/home'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'text/html; charset=utf-8'
			}
		}, function(res) {
			assert.includes(res.body, '<title>DRIS Workflows</title>');
			assert.ok(res);
		});
	},


	'GET /all' : function() {
		assert.ok(app, {
			url : '/all'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'text/html; charset=utf-8'
			}
		}, function(res) {
			assert.includes(res.body, '<title>All</title>');
			assert.ok(res);
		});
	},


	'GET /create' : function() {
		assert.ok(app, {
			url : '/create'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'text/html; charset=utf-8'
			}
		}, function(res) {
			assert.includes(res.body, '<title>Create</title>');
			assert.ok(res);
		});
	},


	'GET /edit' : function() {
		assert.ok(app, {
			url : '/edit'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'text/html; charset=utf-8'
			}
		}, function(res) {
			assert.includes(res.body, '<title>Edit</title>');
			assert.ok(res);
		});
	},


	'GET /admin' : function() {
		assert.ok(app, {
			url : '/admin'
		}, {
			status : 200,
			headers : {
				'Content-Type' : 'text/html; charset=utf-8'
			}
		}, function(res) {
			assert.includes(res.body, '<title>Collections - Admin - DRIS Workflows</title>');
			assert.ok(res);
		});
	},

}
