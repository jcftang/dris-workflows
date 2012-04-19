/**
 * Module dependencies.
 */



exports.configure = function configure(app) {
/*
	// Passport session setup.
	//   To support persistent login sessions, Passport needs to be able to
	//   serialize users into and deserialize users out of the session.  Typically,
	//   this will be as simple as storing the user ID when serializing, and finding
	//   the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		findById(id, function(err, user) {
			done(err, user);
		});
	});
	/*
	 // Use the LocalStrategy within Passport.
	 //   Strategies in passport require a `verify` function, which accept
	 //   credentials (in this case, a username and password), and invoke a callback
	 //   with a user object.  In the real world, this would query a database;
	 //   however, in this example we are using a baked-in set of users.
	 passport.use(new LocalStrategy(function(username, password, done) {
	 // asynchronous verification, for effect...
	 process.nextTick(function() {
	 // Find the user by username.  If there is no user with the given
	 // username, or the password is not correct, set the user to `false` to
	 // indicate failure and set a flash message.  Otherwise, return the
	 // authenticated `user`.
	 findByUsername(username, function(err, user) {
	 if(err) {
	 return done(err);
	 }
	 if(!user) {
	 return done(null, false, {
	 message : 'Unkown user ' + username
	 });
	 }
	 if(user.password != password) {
	 return done(null, false, {
	 message : 'Invalid password'
	 });
	 }
	 return done(null, user);
	 })
	 });
	 }));
	var GOOGLE_CLIENT_ID = "713766413952.apps.googleusercontent.com";
	var GOOGLE_CLIENT_SECRET = "DiblvgE4xAZfe6amLz7Uyubm";
	passport.use(new GoogleStrategy({
		clientID : GOOGLE_CLIENT_ID,
		clientSecret : GOOGLE_CLIENT_SECRET,
		callbackURL : "http://127.0.0.1:3000/auth/google/callback"
	}, function(accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function() {

			// To keep the example simple, the user's Google profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the Google account with a user record in your database,
			// and return that user instead.
			return done(null, profile);
		});
	}));
*/
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
		// Initialize Passport!  Also use passport.session() middleware, to support
		// persistent login sessions (recommended).
		app.use(passport.initialize());
		app.use(passport.session());
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
		/*if( err instanceof NotFound) {
		 res.render('404', {
		 id : "404",
		 title : "404 - Not found"
		 });
		 } else {*/
		next(err);
		//}
	});
	/*
	 function NotFound(msg){
	 this.name = 'NotFound';
	 Error.call(this, msg);
	 Error.captureStackTrace(this, arguments.callee);
	 }

	 NotFound.prototype.__proto__ = Error.prototype;
	 app.get('/*', function(req, res){
	 throw new NotFound;
	 });*/
}