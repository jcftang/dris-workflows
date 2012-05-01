var workspace= backbone();
var goDeeper = true;
var parentType = "";
var editItems = [];
$(document).ready(function() {

	jQuery.support.cors = true;
	switch(window.location.pathname) {
		case "/edit":
			workspace.navigate("#collections", {
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
			workspace.navigate("#collections", {
				trigger : true
			});
			break;
	}

	$("tbody a").live("click", function() {
		goDeeper = true;
		parentType = $(this).attr("data-type");
	});
	$(".close").live("click",function(){
		if(!$(this).hasClass("mdl"))
			$(this).parent().remove();
	});
}); 


function updateChildren(data) {
		for(var i = 0; i < data.length; i++) {
			var link = socket + "/dev/objects/" + data[i]._id + "/update";
			var items = $('#globalData').serializeArray();
			for(var j = 0;j<items.length;j++){
				var item = data[i];
			    eval("item.properties."+items[j].name+"='"+items[j].value+"'");
			}
			console.log(link)
			console.log({"properties" : data[i].properties})
			updateData('POST',{"properties" : data[i].properties} , link, function(id) {
			});
		}
		$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
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
			"properties" : {}
		};
		createMetaDataModels("#collectionCreation", function(model) {
			data.properties = model;
			postData($('#collectionCreation'), 'POST', data, link, function(id) {
				$(".successbox").fadeIn().delay(900).fadeOut();
			});
		});
	})


	$("#createSerieBtn").click(function() {
		var link = socket + "/dev/objects";
		var parent = $("#seriesCollection").val();
		var data = {
			"status" : "open",
			"type" : "series",
			"properties" : {},
			parentId : parent
		};
		if(parent == "") {
			delete data.parentId;
		}
		createMetaDataModels("#serieCreation", function(model) {
			data.properties = model;
			postData($('#serieCreation'), 'POST', data, link, function(id) {
				$(".successbox").fadeIn().delay(900).fadeOut();
			});
		});
		
	});

	$("#createItemBtn").click(function(event) {
		event.preventDefault();
		var objId =  $("#objectId").size();
		if(objId > 0 && $("#step4 #objectId").val() != undefined){
			insertItems();
		}else{
			console.log("create")
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
				updateData('POST', {"properties" : data[i].properties}, link, function(id) {
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


function createItems(itemAmount, objId) {
	amount = parseInt(itemAmount);
	objId = parseInt(objId);
	if(amount > 0 && objId > 0) {
		var link = socket + "/dev/objects";
		var parent = $("#itemEditSelection").val();
		var data = {
			"status" : "open",
			"type" : "item",
			"properties" : {},
			parentId : parent
		};
		if(parent ==""){
			delete data.parentId;
		}
		createMetaDataModels("#itemCreation", function(model) {
			data.properties = model;
			console.log(model)
			/*postData($('#itemCreation'), 'POST', data, link, function(id) {
				if(amount > 0 && objId > 0) {
					objId = objId - 1;
					amount = amount - 1

					createItems(amount, objId);
				}
			});*/
		});

	} else {
		$(".successbox").fadeIn().delay(900).fadeOut();
	}

}

function loadMediaData() {

}

function loadEditData() {

	$("#step2 form input").live("blur", function() {
		
		$(".items li.accordion-heading-focus").css({"background-color":"#9F111B"})
		var pos =$(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")
		createMetaDataModels("#singleData",function(data){
			editItems[pos].properties = data;
		})
		
	}); 
	
	$("#saveAll").click(function(){
		for(var i = 0;i< editItems.length;i++){
			var link = socket + "/dev/objects/" + editItems[i]._id+"/update";
			console.log(link)
			var data = editItems[i];
			delete editItems[i]._id;
			console.log(data);
			updateData('POST', data, link, function(id) {
				console.log(id + " updated")
				if(i = editItems.length -1){
					loadEditObjects();
					$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
				}
			})
			
		}
		
		
	})

	$("#goUp").click(function(event){
		event.preventDefault();
		history.back();
	})
	$("#pidSelect").click(function(event){
		event.preventDefault();
		var id = $('input[type=radio]:checked').attr("data-id");
		$("div.pId").text(id);
		$("#myModal").modal("hide");
		var pos =$(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")
		editItems[pos].parentId = id;
	})
	$("#pIdBtn").click(function(){
		loadpIdData();
	})
	$("#gblUpdate").click(function(){
		updateChildren(editItems);
	})
	$("#gblEdit").click(function(event){
		event.preventDefault();
		$(".controls").hide();
		emptyForm();
		$(".items li").removeClass("accordion-heading-focus");
		$("#multi").show();
		$("#single").hide();
	})
	$('#checkAll').live('click',function() {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$("#itemEditCat").chosen();
	$("#step2Btn").click(function(event) {
		if($('tbody input:checked').size()>0){
			$(".controls").show();
			loadEditObjects();
		}else{
			event.preventDefault();
		}
		
	})
}
function loadEditObjects(){
		var size = $('tbody input:checked').size()
		var arr = new Array();
		$(".pId").text("None");
		var objects = $('tbody input:checked');

		for(var i = 0; i < objects.length; i++) {
			loadData("/dev/objects/" + $(objects[i]).attr("data-id"), function(data) {
				arr.push(data);
				console.log(arr.length)
				if(arr.length == size) {
					showItems(arr)
					emptyForm();
					editItems = arr;
				}
			});

		};
}

function loadAdminData() {
	$('#loadingDiv').show()
	loadData("/dev/objects", function(items) {
			$("tbody").empty();
		for(i in items) {
			var rbt = "<td><input name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			if(window.location.pathname == "/create") {
				rbt = ""
			}
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='"+items[i].type +"'  href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td></tr>")
		}
		$('#loadingDiv').hide()
	});
	
}

function loadpIdData() {
	loadData("/dev/objects", function(items) {
			$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			$(".modal tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='"+items[i].type +"'  href='#pd" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td></tr>")
		}

	});
	
}
function loadPidChildren(id) {

	id = id.substring(2, id.length)

	loadData("/dev/objects/" + id + "/list", function(items) {
			$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='"+items[i].type +"'  href='#pd" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td></tr>")
		}
		if(items.length == 0) {
			$(".modal tbody").append("<tr><td></td><td>No Children here<td></tr>")
		}
	});

}

function loadChildren(id) {
$('#loadingDiv').show()
	id = id.substring(2, id.length)

	loadData("/dev/objects/" + id + "/list", function(items) {
			$("tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			if(window.location.pathname == "/create") {
				rbt = ""
			}
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='"+items[i].type +"'  href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td></tr>")
		}
		$('#loadingDiv').hide()
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
			"id:id" : "defaultRoute",
			"pd:id" : "loadPid",
			"myModal":"loadPidTop",

		},

		step1 : function() {
		
			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step1,#step1Info").show();
		},
		step2 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#multi").hide();
			$("#step2,#step2Info,#single").show();
			$("#properties").show();
			loadpIdData();
			if(goDeeper){
			 	goDeeper = false;
			}
			else{
				if($(".modal .breadcrumb li").size() >= 1){
				$(".modal .breadcrumb li:last").remove();
				$("#goUp").attr("disabled", "disabled");
				}
			}
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

		},
		loadPid : function(){
			if(goDeeper) {
				$(".modal .breadcrumb").append("<li>" + parentType + ": " + Backbone.history.fragment + "<span class='divider'>/</span></li>")
				$("#goUp").removeAttr("disabled");
				goDeeper = false;
			} else {
				$("#goUp").removeAttr("disabled");
				$(".modal .breadcrumb li:last").remove();
			}
			loadPidChildren(Backbone.history.fragment); 
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
	console.log("load")
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
	console.log("remove")
	console.log(link);
	console.log(data);
	$.ajax({
		type : type,
		cache : false,
		data : data,
		url : link,
		success : function(id) {
			console.log("id received" + id)
			workspace.navigate("#collections", {
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

function updateData( type, data, link, callback) {
		$.ajax({
			type : type,
			data : data,
			url : link,
			cache:false,
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
}