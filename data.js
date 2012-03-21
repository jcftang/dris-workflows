/**
 * @author mvanwamb
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)
var fs = require('fs');
var image;

// log4js
var log4js = require('log4js');
var logger = log4js.getLogger();
log4js.addAppender(log4js.fileAppender('dris_workflows.log'), 'dris_workflows', 'console');
logger.setLevel('INFO');

exports.show = function(data,vw){
	res = vw;
	meta = data.body;
	var files = data.files;

	// Create a server instance with default host and port
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
	logger.debug("meta");
	logger.debug(meta);
	//console.log(items);
	//save(meta,files);
	//gridfs();
}


function gridfs(infoId,files) {
	console.log(files);
	var gridfs = db.gridfs()// name defaults to 'fs'

	// Create new file write stream
	var stream = gridfs.create({
		filename : files.media.name,
		metadata : {id:infoId},
		contentType : files.media.type,
		
		
	}).writeStream()

	// Pipe license file to gridfile
	fs.createReadStream(files.media.path).pipe(stream)
	findId(infoId,files.media.name)
}

exports.loadImg = function loadImg(id,name,res){
	console.log(name)
	console.log(id);
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	var gridfs = db.gridfs()// name defaults to 'fs'
	console.log(id.toString());
			gridfs.findOne({filename:name,metadata:{id:id}}, function(err, file) {
				console.log(file);
			if (!err && file) {
				res.writeHead(200, {'Content-Type': 'image/jpeg'});
                var stream = file.readStream();
                stream.on("error", function(err){
                    console.log(err); 
                    
                }).pipe(res);
            }
            else
            {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            }
		})
}

exports.getAll = function getAll(res){
var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	var gridfs = db.gridfs()// 
	var arr = new Array();
	gridfs.find().forEach(function(post) {
		// do something with a single post
		arr.push(post);
		logger.debug(arr);
	}, function() {
		res.render('all', {
				items:arr, id:"all", title:"All"
			})
	})
	console.log("dfqsdqsd");
	console.log(arr);
	

}

function findId(id,name){
	console.log(id);
	var query = {
		_id : new ObjectId(id)
	};
	items.findOne(query, function(err, meta) {
		if(err == null) {
			res.locals({
				data : meta
			});
			
			name = 'image/'+id+'/'+name;
			console.log(name);
			res.render('summary', {
				title : "summary",layout:"layoutOverview",
				url:name, id:"summary"
			})
		}

	})

}
function save(data,files){

	items.save(data, function(err, value) {
		gridfs(value._id.toString(), files);
	});


}

exports.edit = function edit(req,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
	console.log(items);

			
	items.find({series:true}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
			console.log(array[item]._id); 
		}
			
		res.render('test', {
		title : "Edit",id:"test",series:array
		})

	})

	

}

exports.items = function(id,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
			
	items.find({masterId:id}).sort({ created: 1 }).toArray(function (err, array) {
	for(item in array){
			array[item]._id = array[item]._id.toString();
		}
		console.log(array);
		res.send(array);
	})
}

exports.item = function(id,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
			
	items.findOne({_id:new ObjectId(id)},function (err, array) {
			array._id = array._id.toString();
		console.log(array);
		res.send(array);
	})
}

exports.createitem = function(req,res){
		var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	var rootItem = {}
	var rootset = false;
	var item = {};
	console.log(req.body);
	var items = db.collection("series")
		var files = req.body;
		for(var i in files){
			if(rootset == false){
				if(i == 'name'){
					rootItem[i] = files[i];
				}
				if(i = 'author'){
					//rootItem += i +':"'+files[i]+'"';
					rootItem[i] = files[i];
					rootItem.series = true;
					rootset = true;
					console.log(rootItem);
				}
			}
			
			if(i != 'name' && i != 'author' && i != 'amount'){
				item[i] = files[i];
			}
			
		}
		logger.info(req.body.amount)
		logger.info(rootItem);
		logger.info(item);
		items.insert(rootItem, function(err, value) {
			logger.debug(value);
		     var id = value._id.toString();
			 item.masterId = id;
			
			 for(var i = 0;i<req.body.amount;i++){
			 	item._id = new ObjectId();
			 	items.insert(item,function(err, value) {
			 		if(err){
			 			logger.error(err);
			 		}
			 		logger.debug("created");
			 	});
			 }
		});
		
}
