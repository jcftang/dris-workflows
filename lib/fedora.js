/**
 * @author Quirijn Groot Bluemink
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)
var http = require("http");


exports.getFedoraObjects = function getFedoraObjects(req,res){
	var options = {
		host: 'howest-server.tchpc.tcd.ie',
		port: 9191,
		path: '/fedora/objects?terms=*&pid=true&subject=true&label=true&resultFormat=xml'
	};
	
	http.get(options, function(res) {
		console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
		res.render('fedora', {id:"all", title:"All"
			})
	
}
exports.getFedoraList = function getFedoraList(req,res){
	var options = {
		host: 'howest-server.tchpc.tcd.ie',
		port: 9191,
		path: '/fedora/objects?terms=*&pid=true&subject=true&label=true&resultFormat=xml'
	};
	
	http.get(options, function(res) {
		res.on('data', function (xml) {
			console.log(""+xml);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	
}



