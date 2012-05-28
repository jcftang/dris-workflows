/*
 * GET home page.
 */

var winston = require("winston");
exports.home = function(req, res) {
	winston.log("info", "Accessed page: home")
	res.render('index', {
		title : 'DRIS Workflows',
		id : 'home',
	});
}

exports.edit = function(req, res) {
	winston.log("info", "Accessed page: edit")
	res.render('edit', {
		title : "Edit",
		id : "edit",
		layout : '_layouts/editLayout'
	});
}

exports.browse = function(req, res) {
	winston.log("info", "Accessed page: browse")
	res.render('browse', {
		title : "Browse",
		id : "browse",
		layout : '_layouts/browseLayout'
	});
}

exports.overview = function(req, res) {
	winston.log("info", "Accessed page: overview")
	res.render('overview', {
		title : "Overview",
		id : "overview",
		layout : '_layouts/overviewLayout'
	});
}

exports.create = function(req, res) {
	winston.log("info", "Accessed page: create")
	res.render('create', {
		title : 'Create',
		id : 'create',
		layout : '_layouts/createLayout'
	});
}

exports.all = function(req, res) {
	winston.log("info", "Accessed page: all")
	res.render('all', {
		id : "all",
		title : "All",
		layout : '_layouts/allLayout'
	});
}

exports.admin = function(req, res) {
	winston.log("info", "Accessed page: admin")
	res.render('admin', {
		id : "admin",
		title : "Admin",
		user : req.user,
		layout : '_layouts/layoutAdmin'
	});
}

exports.globalEdit = function(req, res) {
	winston.log("info", "Accessed page: global edit")
	res.render('globaledit', {
		id : "edit",
		title : "edit",
		user : req.user,
		_id : req.params.id,
		layout : '_layouts/editLayout'
	});
}

exports.upload = function(req, res) {
	winston.log("info", "Accessed page: upload")
	res.render('_includes/upload', {
		id : "upload",
		title : "Upload",
		layout : false
	});
}

exports.results = function(req, res) {
	winston.log("info", "Accessed page: result")
	res.render('result', {
		id : "result",
		title : "result",
	});
}
exports.compare = function(req, res) {
	winston.log("info", "Accessed page: compare")
	res.render('compare', {
		id : "compare",
		title : "Compare",
		layout : '_layouts/layoutAdmin',
	});
}