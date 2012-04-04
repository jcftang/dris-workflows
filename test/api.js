var assert = require('chai').assert;
var request = require('request');
var express = require('express');
var appRoutes = require('../app-routes');
var appConfig = require('../app-config');
var app = module.exports = express.createServer();

appConfig.configure(app);
appRoutes.createRoutes(app);
app.listen(7001);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

describe('API tests', function() {

	describe('POST /object/collection/c/post', function() {
		it("should respond with the create site", function(done) {
			request({
				method : 'POST',
				uri : 'http://localhost:7000/object/collection/c/post',
				form : {
					Title : 'RoutesAutobotCollection'
				}
			}, function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, 'create');
				done();
			});
		});
	});
	describe('POST /object/series/c/post', function() {
		it("should respond with the create site", function(done) {
			request({
				method : 'POST',
				uri : 'http://localhost:7000/object/series/c/post',
				form : {
					Title : 'RoutesAutobotSeries',
					Author : "AutoBot"
				}
			}, function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, 'create');
				done();
			});
		});
	});
	describe('POST /object/item/c/post', function() {
		it("should respond with the create site", function(done) {
			request({
				method : 'POST',
				uri : 'http://localhost:7000/object/item/c/post',
				form : {
					Title : 'RoutesAutobotItem',
					Subtitle : 'RoutesAutobotItemSubtitle',
					Author : "AutoBot",
					objectId : 1,
					parentId : ''
				}
			}, function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, 'create');
				done();
			});
		});
	});
});
