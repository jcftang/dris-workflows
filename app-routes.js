/**
 * Module dependencies.
 */
var routes = require('./routes');
var passport;
exports.createRoutes = function make(app, pass) {
	passport = pass;
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
	app.get('/edit/:id/global',routes.globalEdit)
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
	// GET /auth/google
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	app.get('/auth/google', passport.authenticate('google', {
		scope : ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
	}), function(req, res) {
		// The request will be redirected to Google for authentication, so this
		// function will not be called.
	});
	// GET /auth/google/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/google/callback', passport.authenticate('google', {
		failureRedirect : '/login'
	}), function(req, res) {
		res.redirect('/');
	});
	// POST /login
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	//
	//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
	/*app.post('/login', passport.authenticate('local', {
		failureRedirect : '/login',
		failureFlash : true
	}), function(req, res) {
		res.redirect('/');
	});*/
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}
function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}