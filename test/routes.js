var assert = require('chai').assert;
var request = require('request');

/**
 * Module dependencies.
 */
var express = require('express');
var appRoutes = require('../app-routes');
var appConfig = require('../app-config');
var app = module.exports = express.createServer();

var portNumber = 7000
appConfig.configure(app);
appRoutes.createRoutes(app);
app.listen(portNumber);

//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

describe('Try accessing top level Routes', function() {
	describe('GET /home', function() {
		it("should respond with the home page", function(done) {
			request('http://localhost:' + portNumber + '/home', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>DRIS Workflows</title>');
				done();
			});
		});
	});
	describe('GET /all', function() {
		it("should respond with the all page", function(done) {
			request('http://localhost:' + portNumber + '/all', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>All</title>');
				done();
			});
		});
	});
	describe('GET /create', function() {
		it("should respond with the create page", function(done) {
			request('http://localhost:' + portNumber + '/create', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>Create</title>');
				done();
			});
		});
	});
	describe('GET /edit', function() {
		it("should respond with the edit page", function(done) {
			request('http://localhost:' + portNumber + '/edit', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>Edit</title>');
				done();
			});
		});
	});
	describe('GET /admin', function() {
		it("should respond with the admin page", function(done) {
			request('http://localhost:' + portNumber + '/admin', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>Admin</title>');
				done();
			});
		});
	});
	describe('GET /404', function() {
		it("should respond with the admin page", function(done) {
			request('http://localhost:' + portNumber + '/sdfagfgarg', function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, '<title>404 - Error</title>');
				done();
			});
		});
	});
});
