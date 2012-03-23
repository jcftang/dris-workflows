
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , log4js = require('log4js');



var logger = log4js.getLogger('dris_workflows');
logger.setLevel('INFO');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({keepExtensions: true}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
app.get('/all',routes.all);
app.get('/admin',routes.adminMain);
app.get('/admin/:id',routes.adminSerie);
app.get('/create',routes.create);
app.get('/home', routes.home);
app.get('/image/:name/:id', routes.image);
app.get('/series',routes.getAllSeries); //Returns all the series
app.get('/item/:id',routes.getItem);
app.get('/items/:id',routes.getItems);
app.get('/edit', routes.edit);
app.post('/post', routes.data);
app.post('/create/item',routes.createItem);
app.post('/create/serie',routes.createSerie)
app.get('/list/images/:id',routes.getItemImages);
app.get('/remove',routes.remove);
// Redirects
app.get('/', function(req, res){
	res.redirect('/home');
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
