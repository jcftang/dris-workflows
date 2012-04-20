var w = backbone();
var goDeeper = true;
var parentType = "";

$(document).ready(function() {

	jQuery.support.cors = true;
	switch(window.location.pathname) {
		case "/edit":
			w.navigate("#collections", {
				trigger : true
			});
			$("#properties").hide();
			loadEditData();
			break;
		case "/all":
			loadMediaData();
			break;
		case "/create":
		$("#properties").hide();
			loadCreateData();
			w.navigate("#collections", {
				trigger : true
			});
			break;
	}
	$("#updateItems").click(function(event) {
		updateChildren()
	})

	$("tbody a").live("click", function() {
		goDeeper = true;
		parentType = $(this).attr("data-type");
	})
}); 


function updateChildren() {

	var type = "";
	loadData("/dev/objects/" + $("#parentId").val() + "/list", function(data) {
		for(var i = 0; i < data.length; i++) {
			var link = socket + "/dev/objects/" + data[i]._id + "/update";
			var items = $('#updateObjects').serializeArray();
			var items = items.splice(0,1);
			for(var j = 0;j<items.length;j++){
				var item = data[i];
			    eval("item.properties."+items[j].name+"='"+items[j].value+"'");
			}
			updateData($('#updateObjects'), 'POST',{"properties" : data[i].properties} , link, function(id) {
			});
		}
		$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
	})
}

function loadCreateData() {

	$("#createSerie").live("click", function(event) {
		id = Backbone.history.fragment
		if(id != "collections"){
		id = id.substr(2,id.length);
        $("#seriesCollection").val(id)
       }
		emptyForm();
	});

	$("#createCollectionBtn").click(function() {
		var link = socket + "/dev/objects";

		var data = {
			"status" : "open",
			"type" : "collection",
			"properties":{}
		};
		items = $('#collectionCreation').serializeArray();
		postData($('#collectionCreation'), 'POST', prepareDataForPost(data,items), link,function(id){
			$(".successbox").fadeIn().delay(900).fadeOut();
		});
	})

	$("#createSerieBtn").click(function() {
		var link = socket + "/dev/objects";
		var parent= $("#seriesCollection").val();
		var data = {
			"status" : "open",
			"type" : "series",
			"properties":{},
			parentId : parent
		};
		if(parent == ""){
			delete data.parentId;
		}
		var items = $('#serieCreation').serializeArray();
		postData($('#serieCreation'), 'POST', prepareDataForPost(data,items), link,function(id){
			$(".successbox").fadeIn().delay(900).fadeOut();
		});
	});
	
	$("#createItemBtn").click(function(event) {
		event.preventDefault();
		var objId =  $("#objectId").size();
		if(objId > 0 && $("#step4 #objectId").val() != undefined){
			insertItems();
		}else{
			var amount =  $("#amount").val();
			createItems(amount,amount);
		}
	});
	

}




function insertItems() {
	var objId = parseInt($("#step4 #objectId").val());
	loadData("/dev/objects/" + $("#itemEditSelection").val() + "/list", function(data) {
		for(var i = 0; i < data.length; i++) {
			if(parseInt(data[i].properties.objectId) >= parseInt(objId)) {
				var link = socket + "/dev/objects/" + data[i]._id + "/update";
				data[i].properties.objectId = parseInt(data[i].properties.objectId) + 1;
				updateData($("#itemCreation"), 'POST', {"properties" : data[i].properties}, link, function(id) {
				})
			}
			if(i == data.length - 1) {
				var amount = parseInt($("#amount").val());
				objId = amount + objId;
				createItems(amount, objId)
			}
		}
	});
}






function createItems(itemAmount,objId) {
	amount = parseInt(itemAmount);
	objId =  parseInt(objId);
	console.log(amount)
	console.log(objId)
	if(amount > 0 && objId > 0) {
		console.log("create")
		var link = socket + "/dev/objects";
		var parent = $("#itemEditSelection").val();
		var data = {
			"status" : "open",
			"type" : "item",
			"properties" : {},
			parentId : parent
		};
		data.properties.objectId = objId;
		if(parent == "") {
			delete data.parentId;
		}
		var items = $('#itemCreation').serializeArray();

		items.splice(0, 1);
		postData($('#itemCreation'), 'POST', prepareDataForPost(data, items), link, function(id) {
			if(amount > 0 && objId > 0) {
				objId = objId -1;
				amount = amount - 1

				createItems(amount,objId);
			}
		});
	} else {
		$(".successbox").fadeIn().delay(900).fadeOut();
	}

}






function prepareDataForPost(data,items){
		for (var key in items) {
 				eval("data.properties."+items[key].name+"='"+items[key].value+"'");
	 	}
	 	return data
}

function loadMediaData() {

}

function loadEditData() {
	
	$("#itemEditCat").chosen();
	$("#step2Btn").click(function() {
		item = $("input[type=radio]:checked").attr("data-id");
		console.log(item)
		loadData("/dev/objects/" + item, function(data) {
			showItems([data], false)
			loadData("/dev/objects/" + item+ "/list", function(data) {
				showItems(data, true)
				emptyForm();
			});
		});
	})
}


function loadAdminData() {
	loadData("/dev/objects", function(items) {
			$("tbody").empty();
		for(i in items) {
			var rbt = "<td><input name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			if(window.location.pathname == "/create") {
				rbt = ""
			}
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='"+items[i].type +"'  href='#id" + items[i]._id + "'>" + items[i].properties.title + "</a></td><td>" + items[i].type + "</td></tr>")
		}
	});
	
}

function loadChildren(id) {

	id = id.substring(2, id.length)

	loadData("/dev/objects/" + id + "/list", function(items) {
			$("tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			if(window.location.pathname == "/create") {
				rbt = ""
			}
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='"+items[i].type +"'  href='#id" + items[i]._id + "'>" + items[i].properties.title + "</a></td><td>" + items[i].type + "</td></tr>")
		}
		if(items.length == 0) {
			$("tbody").append("<tr><td></td><td>No Children here<td></tr>")
		}
	});

}






function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"edit" : "step2",
			"step1" : "step1", // #help
			"step2" : "step2", // #search/kiwis
			"step3" : "step3",
			"step4" : "step4",
			"collections" : "collection",
			"id:id" : "defaultRoute"

		},

		step1 : function() {
		
			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step1,#step1Info").show();
		},
		step2 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step2,#step2Info").show();
			$("#properties").show();


		},
		step3 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step3,#step3Info").show();
			$("#properties").show();

		},
		step4 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step4,#step4Info").show();
			$("#properties").show();

		},
		collection : function() {
			$("tbody").empty();
			 if(goDeeper){
			 	goDeeper = false;
			}
			else{
				if($(".row .breadcrumb li").size() >= 1){
				$(".row .breadcrumb li:last").remove();
				}
			}
 			loadAdminData();
 			resetCreatePage()
		},
		defaultRoute : function() {
			console.log("$")
			console.log($("tbody"))

			if(goDeeper) {
				$(".row .breadcrumb").append("<li>" + parentType + ": " + Backbone.history.fragment + "<span class='divider'>/</span></li>")
				goDeeper = false;
			} else {
				
				$(".row .breadcrumb li:last").remove();
			}
			resetCreatePage();
			$("#createCollection").hide();
			loadChildren(Backbone.history.fragment); 

		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}
function resetCreatePage(){
		$("#createCollection").show();
 			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step1,#step1Info").show();
}
/*Function: loadData

 Gets any data from the server and gives it back

 Parameters:

 link - url where the data should come frome
 callback - the function to return it to

 Returns:

 The requested data
 */

function loadData(link, callback) {
	console.log(socket + link)
	$.ajax({
		url : socket + link,
		cache:false,
		type:"GET",
		dataType : 'jsonp',
		success : function(data) {
			callback(data);
		},
		error : function(x, h, r) {
			console.log(x);
			console.log(h);
			console.log(r);
		}
	});

}

function postData(form, type, data, link, callback) {
	console.log(link);
	console.log(data);
	$.ajax({
		type : type,
		cache : false,
		data : data,
		url : link,
		success : function(id) {
			console.log("id received" + id)
			w.navigate("#collections", {
				trigger : true
			});
			if(callback != undefined) {
				callback(id);
			}
		},
		error : function(x, h, r) {
			console.log(x);
			console.log(h);
			console.log(r);
		}
	});
}

function updateData(form, type, data, link, callback) {
	console.log(data);
	form.submit(function() {
		$.ajax({
			type : type,
			data : data,
			url : link,
			success : function(id) {
				console.log("id");
					callback(id);
			},
			error : function(x, h, r) {
				console.log(x);
				console.log(h);
				console.log(r);
			}
		})
		return false;
	});
	form.submit();
}



/*
 ALL

 - each val, key in items
 tr(id="#{val._id}")
 td
 input(type="checkbox",data-id="#{val._id}")
 td
 a(href="object/media/#{val._id}/remove") #{val._id}
 td #{val.filename}
 td
 a.btn.btn-danger.btn-mini.removeItem(href="object/media/#{val._id}/remove") Remove
 */