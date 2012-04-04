var assert = require('chai').assert;
var request = require('request');

/**
 * Module dependencies.
 */
var express = require('express');
var appRoutes = require('../app-routes');
var appConfig = require('../app-config');
var app = module.exports = express.createServer();

appConfig.configure(app);
appRoutes.createRoutes(app);
app.listen(7001);

//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

describe('Try and test the API', function() {

	describe('POST /object/:type/:id/:command', function() {
		it("should respond with the create created collection", function(done) {
			request({
				method:'POST',
				uri: 'http://localhost:7000/object/collection/c/post',
				form: {Title:'RoutesAutobot'}
			}, function(err, resp, body) {
				assert.isNull(err);
				assert.include(body, 'create');
				done();
			});
		});
	});
});
