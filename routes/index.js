
/*
 * GET home page.
 */
var data = require("dri");
var fedora = require("fedora");
var admin = require("../lib/admin");

exports.home = function(req, res){
  res.render('index', {
    title: 'DRIS Workflows',
    id: 'home'
  });
}


exports.edit = function(req, res){

	data.getAllRecordsByType("serie",function(array) {
		res.render('edit', {
			title : "Edit",
			id : "edit",
			series : array
		})
	});

}

exports.data = function(req, res){
  data.updateItem(req);
}

exports.image=function(req,res){
	data.loadImg(req.params.name,req.params.id,res);
}

exports.all=function(req,res){
	data.getAllMediaItems(function(arr){
		res.render('all', {
				items:arr, id:"all", title:"All"
			})
	});
}

exports.createItem = function(req,res){
	data.createitem(req,function(){
			res.render('_includes/complete', {
				title : "Complete",
				id : "complete",
				item : "Everything"
			})
	});
}
exports.createSeries = function(req,res){
	data.createSeries(req,function(){
		res.send(0);
	});
}

exports.createCollection = function(req,res){
	data.createCollection(req,function(){
		res.redirect('/create');
	});
}
exports.getAllSeries = function(req,res){
	data.getAllSeries(function(arr){
		res.send(arr);
	});

}
exports.getAllCollections = function(req,res){
	data.getAllCollections(function(arr){
		res.send(arr);
	});

}

exports.getAllItems= function(req,res){
	data.getAllItems(function(arr){
		res.send(arr);
	});

}

exports.getItems = function(req,res){
	data.getItems(req.params.id,function(array){
		res.send(array);
	});
}

exports.getItem = function(req,res){
	data.getItem(req.params.id,function(array){
		res.send(array);
	});
}

exports.getItemImages = function(req,res){
	data.findImages(req.params.id,function(files){
		res.send(files);
	});
}

exports.create = function(req,res){
	res.render('create', {
    title: 'Create',
    id: 'create'
  });
}
  
exports.adminMain = function(req,res){
	data.getAllRecordsByType("serie",function(array){
		res.render('admin', 
			{title : "Admin series"
			, id:"getSeries"
			, series:array
			, layout:"_layouts/layoutAdmin"}
		)
	});

}
exports.adminSerie = function(req,res){
	data.getItems(req.params.id,function(array){
		res.render('_includes/adminItems', 
			{title: "Admin series"
			, id: "getSeries"
			, series: array
			, layout: "_layouts/layoutAdmin"}
		)
	});
}

exports.removeItem = function(req,res){
	data.removeItem(req.params.id,function(){
		res.send("0");
	})
}

exports.fedoraCreateObject = function(req,res){
	data.approveItem(req.params.id, "cfedoraLib",function(response){
		//success
		res.send(response);
	}, function(e){
		//error
		res.send(e);
		console.log(e);
	});
}




























