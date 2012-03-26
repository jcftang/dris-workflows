/**
 * @author mvanwamb
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)
var fs = require('fs');
var image;


/*
   Function: Save

   Saves the metadata object

   Parameters:

      data - the metadata object
      files - the files that are uploaded
*/
exports.save = function save(data,files){
	
	//convert String id to bytes
	data._id = new ObjectId(data._id);
	//remove the surcheck value (checks if there is an image)
	var image = false;
	if(data["surcheck"]){
		image = true;
	}
    delete data["surcheck"]
    //saves the metadata in the items collection
	items.save(data, function(err, value) {
		if(image) {
			//if there is an image it needs to be stored
			gridfs(value._id.toString(), files)
		}
	});
}


/*
   Function: gridfs

   Stores the file into mongodb gridfs

   Parameters:

      id - id of the metadata object
      file - file that needs to be stored
*/
exports.gridfs = function gridfs(infoId,files) {
	var gridfs = db.gridfs()// name defaults to 'fs'

	// Create new file write stream
	var stream = gridfs.create({
		filename : files.media.name,
		metadata : {id:infoId},
		contentType : files.media.type,
		
		
	}).writeStream()

	// Pipe file to gridfile
	fs.createReadStream(files.media.path).pipe(stream)
	//findId(infoId,files.media.name)
}


/*
   Function: getSeries

   Callbackfunction that returns all seris

   Parameters:

      callback - function to callback
      res - result object
*/
exports.getSeries = function getSeries(callback){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")

		
	items.find({series:true}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
		}
		callback(array)
	});
}


exports.getAllItems = function getAllItems(callback){

	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
	items.find().sort({created : 1}).toArray(function(err, array) {
		for(item in array) {
			array[item]._id = array[item]._id.toString();
		}
		callback(array);
	});

}
exports.getSeriesItemsByID = function getSeriesItemsByID(id, callback){
	var server = new Mongolian;
	
	// Get database
	db = server.db("mydb");
	
	// Get collections
	series = db.collection("series")

	series.find({masterId:id}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
		} 
		server.close();
		callback(array);
	});
}
