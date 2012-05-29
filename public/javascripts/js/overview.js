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
			console.log(data.fileLocation)
			root += "<tr><td colspan='2'><a href='" + publicDirectory + "/" + data.fileLocation[i].fileLocation + "'>" + data.fileLocation[i].fileLocation + "</a><span class='divider'> | </span><a class=' btn displayMedia' data-toggle='button' href='#' data-type='"+data.fileLocation[i].type+"'>display</a></td></tr>";
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
	$(".displayMedia").click(function(){
		if($(this).hasClass("active")){
			$(this).next().remove();
		}else{
		displayMedia(this,$(this).prev().prev().attr("href"))
		}
	})
}

//Display the image/video or sound file 
function displayMedia(obj, link) {
	var type = $(obj).attr("data-type");
	var typeSub = type.substr(type.indexOf("/") + 1);
	var typeParent = type.substr(0, type.indexOf("/"));
	switch(typeParent) {
		case "image":
			if(typeSub == "jpeg" || typeSub == "png" || typeSub == "gif") {
				$(obj).after("<div class='mediaContainer'><img src='" + link + "'></div>")
			} else {
				$(obj).after("<div>Image type not supported. You can download it by clicking the link.</div>");
			}
			break;
		case "video":
			if(browserMediaTest(typeSub)) {
				$(obj).after('<div><video width="320" height="240" controls="controls"><source src="' + link + '" type="' + type + '" /> Your browser does not support html5 video.</video></div>');
			} else {
				$(obj).after("<div>Video type not supported. You can download it by clicking the link.</div>");
			}
			break;
		case "audio":
			$(obj).after('<div><audio controls="controls"><source src="' + link + '" type="audio/mpeg" /> Your browser does not support html5 audio.</audio></div>')
			break;
		default:
			alert("This media type is not supported.")
			break;

	}
}

//check what browser you are using and if the browser is able to play your video file
function browserMediaTest(type){
	type = type.toLowerCase();
	
	 if ($.browser.webkit) {
	 	if(type == "mp4"||type == "ogg"||type == "webm"){
	 		return true
	 	}
	 }else if($.browser.msie){
	 	if(type == "mp4"){
	 		return true
	 	}
	 }else if($.browser.mozilla){
	 	if(type == "ogg" || type == "webm"){
	 		return true;
	 	}
	 }else if($.browser.safari ){
	 	if(type == "mp4"){
	 		return true
	 	}
	 }else{
	 	return false;
	 }
	
}
