/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes');
var app = module.exports = express.createServer();

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


// Routes
app.get('/admin', routes.adminCollections);
app.get('/admin/series/:id', routes.adminSeries);
app.get('/admin/items/:id', routes.adminItems);

//Top routes
//Loads all page with all media objects
app.get('/all', routes.all); 
//loads the create page
app.get('/create', routes.create);
//loads the edit page
app.get('/edit', routes.edit);
//loads the home page
app.get('/home', routes.home);

app.get("/object/:type/:id/:command",routes.processRequest)
app.post("/object/:type/:id/:command",routes.processRequest)
//----------------------------------------------------------------------------
//removes a media object with certain id
//refactor /:type/:id/:command
//app.get('/media/:id/remove', routes.removeMedia); //refactor /media/:id/remove
//loads the image with certain id
//app.get('/image/:name/:id', routes.image); //refactor /media/:id/get
//loads all images
//app.get('/images/:id/list', routes.getItemImages);//refactor /media/:id/list
//----------------------------------------------------------------------------
//creates a new collection
//refactor /:type/:id/:command
//app.post('/collection/post', routes.createCollection)//refactor /collection/c/post
//loads all collections
//app.get('/collections', routes.getAllCollections);//refactor /collection/all/get
//----------------------------------------------------------------------------
//creates a new serie
//refactor /:type/:id/:command
//app.post('/series/create', routes.createSeries)//refactor /series/c/post
//gets all the series
//app.get('/series', routes.getAllSeries);//refactor /series/all/get
//----------------------------------------------------------------------------
//gets all items
//refactor /:type/:id/:command
//app.get('/items', routes.getAllItems); //refactor /items/:all/:get
//gets all items from a parentId
//app.get('/items/:id', routes.getItems);//refactor /items/:id/:get
//----------------------------------------------------------------------------
//refactor /:type/:id/:command
//gets an item with a certain id
//app.get('/item/:id', routes.getItem);//refactor /item/:id/:get
//removes an item with a certain id
//app.get('/item/:id/remove', routes.removeItem);//refactor /item/:id/:remove
//creates an item
//app.post('/item/create', routes.createItem);//refactor /item/c/post
//----------------------------------------------------------------------------
//refactor /:type/:id/update
//updates an object(series/collection or item)
app.post('/post', routes.data); //refactor /update
//----------------------------------------------------------------------------
app.get('/fedora', routes.fedora);
app.get('/fedora/list', routes.fedoraList);
app.get('/fedora/:id/approve', routes.fedoraCreateObject);

// Redirects
app.get('/', function(req, res) {
	res.redirect('/home');
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

module.exports = app;

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
