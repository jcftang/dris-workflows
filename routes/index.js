/*
 * GET home page.
 */
var data = require("dri");
var fedora = require("fedora");
var admin = require("../lib/admin");

exports.home = function(req, res) {
	res.render('index', {
		title : 'DRIS Workflows',
		id : 'home'
	});
}

exports.edit = function(req, res) {

	data.getAllRecordsByType("serie", function(array) {
		res.render('edit', {
			title : "Edit",
			id : "edit",
			series : array
		})
	});
}

exports.data = function(req, res) {
	data.updateItem(req);
}

exports.image = function(req, res) {
	data.loadImg(req.params.name, req.params.id, res);
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

exports.createItem = function(req, res) {
	req.body.parentId = req.body.collection
	delete req.body.collection;
	console.log(req.body)

	var amount = req.body.amount;
	for(var i = 0; i < amount; i++) {
		req.body.objectId = i + 1;
		data.createItem(req.body, function() {
		});
	}
	res.render('_includes/complete', {
		title : "Complete",
		id : "complete",
		item : "Everything"
	})

}

exports.createSeries = function(req, res) {
	data.createSeries(req.body, function() {
		res.redirect('/create');
	}, function(err) {
		console.log(err);
	});
}

exports.createCollection = function(req, res) {
	data.createCollection(req.body, function() {
		res.redirect('/create');
	}, function(err) {
		console.log(err);
	});
}
exports.getAllSeries = function(req, res) {
	data.getAllRecordsByType("serie", function(arr) {
		res.send(arr);
	});
}
exports.getAllCollections = function(req, res) {
	data.getAllRecordsByType("collection", function(arr) {
		res.send(arr);
	});
}

exports.getAllItems = function(req, res) {
	data.getAllRecordsByType("item", function(arr) {
		res.send(arr);
	});
}

exports.getItems = function(req, res) {
	data.getItems(req.params.id, function(array) {
		res.send(array);
	});
}

exports.getItem = function(req, res) {
	data.getItem(req.params.id, function(array) {
		res.send(array);
	}, function(err) {
		console.log(err);
	});
}

exports.getItemImages = function(req, res) {
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

exports.removeItem = function(req, res) {
	data.removeItem(req.params.id, function() {
		res.send("0");
	}, function(err) {
		console.log(err);
	})
}

exports.removeMedia = function(req, res) {
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