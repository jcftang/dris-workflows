/**
 * @author mvanwamb
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)


exports.getSeries = function getSeries(req,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	series = db.collection("series")
	//console.log(series);

			
	series.find({series:true}).sort({ created: 1 }).toArray(function (err, array) {
		for(serie in array){
			array[serie]._id = array[serie]._id.toString();
		}
		res.render('admin', 
			{title : "Admin series",id:"getSeries",series:array, layout:"layoutAdmin"}
		)
	})
}

function getSeriesItemsByID(serie, callback){
	var server = new Mongolian;
	result = "result";
	
	id=serie._id;
	// Get database
	db = server.db("mydb");
	
	// Get collections
	series = db.collection("series")

	series.find({masterId:id}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
		} 
		serie.items = array;
		callback(serie);
	});
}


