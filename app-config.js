/**
 * Module dependencies.
 */

var express = require('express');
exports.configure = function configure(app) {
	// Configuration
	app.configure(function() {
		app.set('views', __dirname + '/views');
		app.set('view options', {
			layout : "_layouts/layout"
		});
		app.set('view engine', 'jade');
		app.use(express.bodyParser({
			keepExtensions : true
		}));
		app.use(express.methodOverride());
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
		if( err instanceof NotFound) {
			res.render('404', {
				id : "404",
				title : "404 - Not found"
			});
		} else {
			next(err);
		}
	});
}