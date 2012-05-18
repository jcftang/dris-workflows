/**
 * Module dependencies.
 */


var express = require('express');
exports.configure = function configure(app) {

	app.configure(function() {
		app.set('views', __dirname + '/views');
		app.set('view options', {
			layout : "_layouts/layout"
		});
		app.set('view engine', 'jade');
		app.use(express.bodyParser({
			keepExtensions : true
		}));
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.session({
			secret : 'keyboard cat'
		}));
		app.use(express.static(__dirname + '/public'));
		app.use(app.router);
	});

	app.configure('development', function() {
		app.use(express.errorHandler({
			dumpExceptions : true,
			showStack : true
		}));
	});

	app.configure('production', function() {
		app.use(express.errorHandler());
	});

	app.error(function(err, req, res, next) {
		console.log(err);
		next(err);
		
	});

}