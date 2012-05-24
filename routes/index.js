/*
 * GET home page.
 */

exports.home = function(req, res) {
	res.render('index', {
		title : 'DRIS Workflows',
		id : 'home',
		user: req.user
	});
}

exports.edit = function(req, res) {

	res.render('edit', {
		title : "Edit",
		id : "edit",
		user: req.user,
		layout: '_layouts/editLayout'
	});
}

exports.create = function(req, res) {
	res.render('create', {
		title : 'Create',
		id : 'create',
		user: req.user,
		layout: '_layouts/createLayout'
	});
}

exports.all = function(req, res) {

	res.render('all', {
		id : "all",
		title : "All",
		user: req.user,
		layout: '_layouts/allLayout'
	});
}

exports.admin = function(req, res) {

	res.render('admin', {
		id : "admin",
		title : "Admin",
		user: req.user,
		layout: '_layouts/layoutAdmin'
	});
}

exports.globalEdit = function(req,res){
		res.render('globaledit', {
		id : "edit",
		title : "edit",
		user: req.user,
		_id:req.params.id,
		layout: '_layouts/editLayout'
	});
}

exports.upload = function(req, res) {

	res.render('_includes/upload', {
		id : "upload",
		title : "Upload",
		layout: false
	});
}

exports.results = function(req, res) {

	res.render('result', {
		id : "result",
		title : "result",
	});
}
exports.compare = function(req, res) {
	res.render('compare', {
		id : "compare",
		title : "Compare",
		layout: '_layouts/layoutAdmin',
	});
}