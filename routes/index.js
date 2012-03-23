
/*
 * GET home page.
 */

var data = require("../data.js");
var admin = require("../admin.js");
exports.home = function(req, res){
  res.render('index', {
    title: 'DRIS Workflows',
    id: 'home'
  });
}


exports.edit = function(req, res){
	console.log("route")
    data.edit(req,res);
}

exports.data = function(req, res){
  data.show(req,res);
}

exports.image=function(req,res){
	console.log("-- Image request --");
	data.loadImg(req.params.name,req.params.id,res);
}

exports.all=function(req,res){
	data.getAll(res);
}

exports.createItem = function(req,res){
	data.createitem(req,res);
}
exports.createSerie = function(req,res){
	data.createSerie(req,res);
}

exports.getAllSeries = function(req,res){
	data.getAllSeries(req,res);
}

exports.getItems = function(req,res){
	data.getItems(req.params.id,res);
}

exports.getItem = function(req,res){
	data.getItem(req.params.id,res);
}

exports.getItemImages = function(req,res){
	data.findImages(req,res);
}

exports.create = function(req,res){
	res.render('create', {
    title: 'Create',
    id: 'create'
  });
}
  
exports.adminMain = function(req,res){
	admin.getSeries(req,res);
}
exports.adminSerie = function(req,res){
	admin.getItems(req,res);
}
exports.remove = function(req,res){
	data.remove(req,res)
}

exports.removeItem = function(req,res){
	data.removeItem(req,res);
}
