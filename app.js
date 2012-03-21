
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({keepExtensions: true}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/home', routes.index);
app.get('/test', routes.test);
app.get('/image/:name/:id', routes.image);
app.get('/all',routes.all);
app.get('/template',routes.template);
app.post('/post', routes.data);
app.get('/items/:id',routes.items);
app.get('/item/:id',routes.item);
app.get('/create',routes.create);
app.get('/', function(req, res){
 res.redirect('/home');
});



app.get('/example1', function(req, res){
  res.render('example1', {
    title: 'Express',
    id: 'example1'
  });
});




app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
