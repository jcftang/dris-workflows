/*
 * GET home page.
 */
var data = require("dri");
var fedora = require("fedora");

exports.home = function(req, res) {
	res.render('index', {
		title : 'DRIS Workflows',
		id : 'home'
	});
}

exports.edit = function(req, res) {
	data.getAllRecordsByType("series", function(array) {
		res.render('edit', {
			title : "Edit",
			id : "edit",
			series : array
		})
	});
}

exports.data = function(req, res) {
	data.updateItem(req,function(data){
		console.log(data);
	}
	,function(err){
		console.log(err);
	});
}

function getMedia(req, res) {
	data.loadImg(req.params.id, res);
}

exports.all = function(req, res) {
	data.getAllMediaItems(function(arr) {
		res.render('all', {
			items : arr,
			id : "all",
			title : "All"
		})
	});
}

function createItem(req, res) {
	req.body.parentId = req.body.collection
	delete req.body.collection;

	var amount = req.body.amount;
	var incr = false
	if(req.body.objectId){
		incr = true;
	}

	if(incr) {

		insertNewItem(req);
	} else {
		for(var i = 0; i < amount; i++) {
			req.body.objectId = i + 1;

			data.createItem(req.body, function(id) {
			}, function(err) {
				console.log(err);
			});
		}
	}


	
	res.render('_includes/complete', {
		title : "Complete",
		id : "complete",
		item : "Everything"
	})

}


function insertNewItem(req) {
	if(parseInt(req.body.amount) > 0) {
		data.updateIdOrder(req.body.parentId, req.body.objectId, 1, function(d) {
			data.createItem(req.body, function(id) {
				req.body.objectId = parseInt(req.body.objectId) + 1;
				req.body.amount = parseInt(req.body.amount) - 1;
				insertNewItem(req)
			}, function(err) {
				console.log(err);
			});
		})
	}

}


function createSeries(req, res) {
	data.createSeries(req.body, function() {
		res.redirect('/create');
	}, function(err) {
		console.log(err);
	});
}

function createCollection(req, res) {
	data.createCollection(req.body, function() {
		res.redirect('/create');
	}, function(err) {
		console.log(err);
	});
}
function getAllSeries(req, res) {
	data.getAllRecordsByType("series", function(arr) {
		res.send(arr);
	});
}
function getAllCollections(req, res) {
	data.getAllRecordsByType("collection", function(arr) {
		res.send(arr);
	});
}

function getAllItems(req, res) {
	data.getAllRecordsByType("item", function(arr) {
		res.send(arr);
	});
}

function getItems(req, res) {
	data.getItems(req.params.id, function(array) {
		res.send(array);
	});
}

function getItem(req, res) {
	data.getItem(req.params.id, function(array) {
		res.send(array);
	}, function(err) {
		console.log(err);
	});
}

function getItemMedia(req, res) {
	data.findMediaItem(req.params.id, function(files) {
		res.send(files);
	});
}

exports.create = function(req, res) {
	res.render('create', {
		title : 'Create',
		id : 'create'
	});
}

exports.adminCollections = function(req, res) {
	data.getAllRecordsByType("collection", function(array) {
		res.render('adminCollections', {
			title : "Collections - Admin - DRIS Workflows",
			id : "getSeries",
			series : array,
			layout : "_layouts/layoutAdmin"
		})
	});
}
exports.adminSeries = function(req, res) {
	data.getItems(req.params.id, function(array) {
		res.render('adminSeries', {
			title : "Series - Admin - DRIS Workflows",
			id : "getSeries",
			series : array,
			layout : "_layouts/layoutAdmin"
		})
	});
}
exports.adminItems = function(req, res) {
	data.getItems(req.params.id, function(array) {
		res.render('adminItems', {
			title : "items - Admin - DRIS Workflows",
			id : "getSeries",
			series : array,
			layout : "_layouts/layoutAdmin"
		})
	});
}

function removeItem(req, res) {
	console.log(req.body);
	console.log(req.params);
	data.removeItem(req.params.id, function() {
		res.send("0");
	}, function(err) {
		console.log(err);
	})
}

function removeMedia(req, res) {
	data.removeMedia(req.params.id, function(id) {
		res.send(id)
	}, function(err) {
		console.log(err);
	})
}
exports.fedoraCreateObject = function(req, res) {
	data.approveItem(req.params.id, "cfedoraLib", function(response) {
		//success
		res.send(response);
	}, function(e) {
		//error
		res.send(e);
		console.log(e);
	});
}


exports.processRequest = function(req, res) {
	if(req.params.command == "global"){
		console.log("edit");
		res.render("globaledit",{title:"Global edit",id:"global",_id:req.params.id})
	}
	else if(req.params.type == 'media') {
		switch(req.params.command) {
			case "remove":
				removeMedia(req, res);
				break;
			case "get":
				getMedia(req, res);
				break;
			case "list":
				getItemMedia(req, res);
				break;
		}
	}
	else if(req.params.type == 'collection'){
		switch(req.params.command) {
			case "post":
				createCollection(req, res);
				break;
			case "get":
				getAllCollections(req, res);
				break;
		}
	}
	else if(req.params.type == 'series'){
		switch(req.params.command) {
			case "post":
				createSeries(req, res);
				break;
			case "get":
				getAllSeries(req, res);
				break;
		}
	}

	else if(req.params.type == 'item') {
		switch(req.params.command) {
			case "remove":
				removeItem(req, res);
				break;
			case "get":
				getItem(req, res);
				break;
			case "post":
				createItem(req, res);
				break;
		}
	}
	
	
	else if(req.params.type == 'items') {
		switch(req.params.command) {
			case "get":
				getAllItems(req, res);
				break;
			case "put":
				data.globalEdit(req.body,req.files)
			case "getid":
				getItems(req, res);
				break;

		}
	}
}

