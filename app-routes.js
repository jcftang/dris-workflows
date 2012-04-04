/**
 * Module dependencies.
 */
var routes = require('./routes');

exports.createRoutes = function make(app) {
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
app.get('/fedora/:id/approve', routes.fedoraCreateObject);




// API v2
app.get("/documents/collections",routes.getAllCollections)


// Redirects
app.get('/', function(req, res) {
	res.redirect('/home');
});
}

