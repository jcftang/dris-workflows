
/*
 * GET home page.
 */
var data = require("../lib/dri.js");
var admin = require("../lib/admin.js");
var fedora = require("fedora");

exports.home = function(req, res){
  res.render('index', {
    title: 'DRIS Workflows',
    id: 'home'
  });
}


exports.edit = function(req, res){
    data.edit(req,res);
}

exports.data = function(req, res){
  data.updateItem(req,res);
}

exports.image=function(req,res){
	data.loadImg(req.params.name,req.params.id,res);
}

exports.all=function(req,res){
	data.getAll(res);
}

exports.createItem = function(req,res){
	data.createitem(req,res);
}
exports.createSeries = function(req,res){
	data.createSeries(req,res);
}

exports.createCollection = function(req,res){
	data.createCollection(req,res);
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
exports.fedora = function(req,res){
	fedora.getFedoraObjects(req,res);
}
exports.fedoraList = function(req,res){
	fedora.getFedoraList(req,res);
}
