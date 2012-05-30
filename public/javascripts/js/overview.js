var workspace;
var goDeeper = true;
var parentType = "";
var currentParentName = ""
$(document).ready(function(){
	workspace = backbone();
})
	

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
	$("#overview").empty()
	var root = "<table class='table table-bordered infoFloat span12'>"
	root += "<thead><tr ><th colspan='2'><h2>General</h2></th></tr><tr><th>type</th><th>data</th></thead>";
	for(var i in data) {

		if(i != "properties" && i != "fileLocation") {
			root += "<tr><td>" + i + "</td><td>" + data[i] + "</td><tr>"
			if(i == "_id"){
			$(".approveItem").attr("data-id",data[i])
			}
			if(i == "fedoraId"){
				if(data[i] != null){
				$(".approveItem").attr("data-fedora",data[i])
				$(".approveItem").addClass("btn-warning").attr("value","Unapprove").removeClass("btn-success").addClass("unapproveItem").removeClass("approveItem")
			}
			}
			
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
			for(z in info) {

				if( typeof info[z] == "object") {
					for(k in info[z]) {
						var dataObj = info[z][k];
						properties += "<tr><th colspan='2'>" + k + "</th><tr>"
						for(var l in dataObj) {
							properties += "<tr><td>" + l + "</td><td>" + dataObj[l] + "</td><tr>"
						}
					}

				} else {
					properties += "<tr><td>" + z + "</td><td>" + info[z] + "</td><tr>"
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
	
	loadButtonActions()
}

function loadButtonActions(){
	$(document).on("click",".approveItem", function() {
		$this = $(this)
		$this.attr("disabled", "disabled").addClass('disabled').attr("value", "Approving");
		id = $this.attr("data-id");
		approveItem(id, function(err, data) {
			workspace.browse()
			if(err) {
				console.log(err)
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.attr("value", "Approve");
			} else {
				$this.attr("value", "Unapprove").removeAttr("disabled").removeClass('disabled')
				$this.removeClass('approveItem').removeClass('btn-success')
				$this.addClass('unapproveItem').addClass('btn-warning')

			}
		});
	});
	$(document).on("click",'.unapproveItem', function() {
		$this = $(this)
		$this.attr("disabled", "disabled");
		$this.addClass('disabled')
		$this.attr("value", "Unapproving");
		id = $(this).attr("data-id");
		unapproveItem(id, function(err, data) {
			workspace.browse()
			if(err) {
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.attr("value", "Unapprove");
			} else {
				$this.removeAttr("disabled");
				$this.removeClass('unapproveItem')
				$this.addClass('approveItem')
				$this.removeClass('disabled')
				$this.removeClass('btn-warning')
				$this.addClass('btn-success')
				$this.attr("value", "Approve");
			}
		});
	});
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

function approveItem(id, callback) {
	var link = driPath + "objects/" + id + "/approve"
	loadData(link, function(data) {
		callback(null, data)
	}, function(err) {
		console.log(err, null)
	});
};
function unapproveItem(pid, callback) {
	console.log(pid)
	var link = driPath + "objects/" + pid + "/unapprove"
	loadData(link, function(data) {
		callback(null, data)
	}, function(err) {
		console.log(err, null)
	});
};

