var workspace = backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""

function backbone() {
	var Workspace = Backbone.Router.extend({
		routes : {
			"" : "browse",
		},

		browse : function() {
			var id = window.location.pathname.substr(9)
			diplayDetails(id)
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj
}

function diplayDetails(id){
	var link = driPath + "objects" + id
	loadData(link, function(data) {
		viewDetails(data,link)
		
	}, function(err) {
		console.log(err)
	});
}

function viewDetails(data, link) {
	var root = "<table class='table table-bordered infoFloat span12'>"
	root += "<thead><tr ><th colspan='2'><h2>General</h2></th></tr><tr><th>type</th><th>data</th></thead>";
	for(var i in data) {

		if(i != "properties" && i != "fileLocation") {
			root += "<tr><td>" + i + "</td><td>" + data[i] + "</td><tr>"
		}

	}
	root +=  "<tr><td>Json</td><td><a href='"+socket+link+"' target='_blank'>" + link + "</a></td><tr>";
	if(data.properties != undefined){
	root +=  "<tr><td>Dulbin core</td><td><a href='"+socket+link+".dc' target='_blank'>" + link + ".dc</a></td><tr>";
	}
	if(data.fileLocation) {
		root += "</table><table class='table table-bordered span12 infoFloat'><tr ><thead><th colspan='2'><h2>Files</h2></th></tr></thead>";
		for(var i = 0; i < data.fileLocation.length; i++) {
			root += "<tr><td colspan='2'><a href='" + publicDirectory + "/" + data.fileLocation[i].fileLocation + "'>" + data.fileLocation[i].fileLocation + "</a></td></tr>";
		}
	}

	root += "</table>"
	var properties = "<table class='table table-bordered infoFloat span12'><tr ><th colspan='2'><h2>Properties</h2></th><tr>";
	for(var i in data.properties) {
		var obj = i;
		properties += "<tr><th colspan='2'><h3>" + i + "</h3></th><tr>";
		for(var j in data.properties[i]) {
			var info = data.properties[obj][j]
			for(i in info) {

				if( typeof info[i] == "object") {
					var info = info[i]
					for(var k in info) {
						properties += "<tr><th colspan='2'>" + k + "</th><tr>";
						for(l in info[k]) {

							properties += "<tr><td>" + l + "</td><td>" + info[k][l] + "</td><tr>"
						}
					}
				} else {
					properties += "<tr><td>" + i + "</td><td>" + info[i] + "</td><tr>"
				}
			}
		}
	}
	
	if(data.properties == undefined){
		properties += "<tr><td colspan='2'>None</td></tr>"
	}

	properties += "</table>"
	$("#overview").append(root+properties)
}
