
/*
 * GET home page.
 */

var data = require("../data.js");
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};


exports.test = function(req, res){
  res.render('test', { title: 'Express' })
};

exports.data = function(req, res){
	//console.log(req.body);
    console.log(req.files);
  data.show(req,res);
}