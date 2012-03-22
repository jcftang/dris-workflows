
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


exports.test = function(req, res){
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

exports.createitem = function(req,res){
	data.createitem(req,res);
}
exports.template=function(req,res){
	res.render('template', { title: 'Template' })
}

exports.items = function(req,res){
	data.items(req.params.id,res);
}

exports.item = function(req,res){
	data.item(req.params.id,res);
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
  
exports.admin = function(req,res){
	admin.getSeries(req,res);
}
