/**
 * Module dependencies.
 */

var express = require('express');
var appRoutes = require('./app-routes');
var appConfig = require('./app-config');
var app = module.exports = express.createServer();

var util = require('util');


// Configuration
// See app-config.js to see the configuration of the application
appConfig.configure(app);

// Creates routes
// See app-routes.js to see the routes for the application
appRoutes.createRoutes(app);

module.exports = app;

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
