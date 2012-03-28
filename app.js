/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');


var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view options', { layout:"_layouts/layout"}),
  app.set('view engine', 'jade');
  app.use(express.bodyParser({keepExtensions: true}));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


app.error(function(err, req, res, next){
	console.log(err);
    if (err instanceof NotFound) {
        res.render('404',{id:"404",title:"404 - Not found"});
    } else {
        next(err);
    }
});


// Routes
app.get('/admin',routes.adminMain);
app.get('/admin/:id',routes.adminSerie);

app.get('/all',routes.all);
app.get('/create',routes.create);
app.get('/edit', routes.edit);
app.get('/home', routes.home);

app.get('/image/:name/:id', routes.image);
app.get('/images/:id/list',routes.getItemImages);
app.get('/item/:id',routes.getItem);
app.get('/item/:id/remove',routes.removeItem);
app.get('/items/:id',routes.getItems);
app.get('/series',routes.getAllSeries); //Returns all the series
app.get('/fedora',routes.fedora);
app.get('/fedora/list',routes.fedoraList);

app.post('/item/create',routes.createItem);
app.post('/collection/post',routes.createCollection)
app.post('/series/create',routes.createSeries)
app.post('/post', routes.data);


// Redirects
app.get('/', function(req, res){
	res.redirect('/home');
});


function NotFound(msg){
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}


NotFound.prototype.__proto__ = Error.prototype;
app.get('/*', function(req, res){
	throw new NotFound;
});

module.exports = app;

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
