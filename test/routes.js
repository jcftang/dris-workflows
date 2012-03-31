var app = require('../app'), assert = require('assert');
process.env.NODE_ENV = 'test';

module.exports = {
	'GET /home' : function() {
		assert.response(app, {
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
		assert.response(app, {
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
		assert.response(app, {
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
		assert.response(app, {
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
		assert.response(app, {
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
