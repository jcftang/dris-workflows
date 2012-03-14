/**
 * @author mvanwamb
 */
var vw;
var obj;
var files;
exports.show = function(data,res){
	vw=res;
	obj = data.body;
	files = data.files;
	console.log("HEll yea")
	console.log(data.body);
	var databaseUrl = "mydb"; // "username:password@example.com/mydb"
	var collections = ["users", "reports"]
	db = require("mongojs").connect(databaseUrl, collections);
	save();
	var gs = db.fs;
}


function findId(id){
		db.users.find({_id: id}, function(err, users) {
	  if( err || !users){ 
	  	console.log("Nothing found");
	  	}
	  else {
	  var usrs = new Array();
	  users.forEach( function(femaleUser) {
		usrs.push(femaleUser);
	  });
	  	  vw.locals({user: usrs });
	  	  vw.render('post', { title:"show"})
	  }
	  
	});
}
function save(){
var id = db.users.save(obj, function(err, saved) {
	  if( err || !saved ) console.log("User not saved");
	  else{
	  	console.log("saved!");
	  	findId(saved._id)
	  }
	  })
	
	/*db.users.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "female"}, function(err, saved) {
	  if( err || !saved ) console.log("User not saved");
	  else console.log("User saved");
	});*/
}