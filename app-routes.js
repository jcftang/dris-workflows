/**
 * Module dependencies.
 */
var routes = require('./routes');

exports.createRoutes = function make(app) {

	//Top routes
	//Loads all page with all media objects
	app.get('/all', routes.all);
	//loads the create page
	app.get('/create', routes.create);
	//loads the edit page
	app.get('/edit', routes.edit);
	//loads the home page
	app.get('/home', routes.home);
	app.get('/admin', routes.admin);
	// Redirects
	app.get('/', function(req, res) {
		res.redirect('/home');
	});
	
	app.get('/login', function(req, res) {
		res.render('login', {
			user : req.user,
			message : req.flash('error'),
			title : "login",
			id : "login"
		});
	});

}
