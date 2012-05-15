var workspace= backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""
var editItems = [];
var fileUploadLocation = new Array();
var navloc = new Array()
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
		case "/create":
			$("#properties").hide();
			loadCreateData();
			workspace.navigate("#collections", {
				trigger : true
			});
			break;
	}

	$(document).live("click","tbody a",function(event) {
		goDeeper = true;
		parentType = $(this).attr("data-type");
		currentParentName = $(this).text()
	});
	$(document).on("click",".close", function() {
		if(!$(this).hasClass("mdl"))
			$(this).parent().remove();
	});

	$(document).on("click", "form .breadcrumb li a", function(event) {
		event.preventDefault()
		$(this).parent().nextAll().remove();
		goDeeper = false;
		$(".row .breadcrumb").append("<li>")
		workspace.navigate("#" + $(this).attr("href"), {
			trigger : true
		});
	});

});


function updateChildren(data) {
	for(var i = 0; i < data.length; i++) {
		var link = socket + "/dev/objects/" + data[i]._id + "/update";
		var items = $('#globalData').serializeArray();
		for(var j = 0; j < items.length; j++) {
			var item = data[i];
			eval("item.properties." + items[j].name + "='" + items[j].value + "'");
		}
		updateData('POST', {
			"properties" : data[i].properties
		}, link, function(id) {
		});
	}
	$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
}

function loadCreateData() {

		$('#uploadFile').fileupload({
			forceIframeTransport : true,
			url : this.action,
			done : function(e, data) {
			}
		})
		$('#uploadFile').fileupload('option', 'redirect', window.location.href.replace(/\/[^\/]*$/, '/cors/result?'));
	

	$("#createSerie").live("click", function(event) {
		id = Backbone.history.fragment
		if(id != "collections") {
			id = id.substr(2, id.length);
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

		if(fileUploadLocation.length > 0) {
			data.fileLocation = fileUploadLocation;
		}

		createMetaDataModels("#collectionCreation", function(model) {
			data.properties = model;
			postData($('#collectionCreation'), 'POST', data, link, function(id) {
				$(".successbox").fadeIn().delay(900).fadeOut();
				fileUploadLocation = new Array()
				goDeeper = false;
				workspace.navigate("#collections", {
					trigger : true
				}); 

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
		if(fileUploadLocation.length > 0) {
			data.fileLocation = fileUploadLocation;
		}
		createMetaDataModels("#serieCreation", function(model) {
			data.properties = model;

			postData($('#serieCreation'), 'POST', data, link, function(id) {
				$(".successbox").fadeIn().delay(900).fadeOut();
				fileUploadLocation = new Array();
				goDeeper = false;
				workspace.navigate("#collections", {
					trigger : true
				});
			});
		});

	}); 


	$("#createItemBtn").click(function(event) {
		event.preventDefault();
		var objId = $("#objectId").size();
		if(objId > 0 && $("#step4 #objectId").val() != undefined) {
			insertItems();
		} else {
			var amount = $("#amount").val();
			createItems(amount, amount);
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
				updateData('POST', {
					"properties" : data[i].properties
				}, link, function(id) {
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
		if(parent == "") {
			delete data.parentId;
		}
		if(fileUploadLocation.length > 0) {
			data.fileLocation = fileUploadLocation;
		}

		createMetaDataModels("#itemCreation", function(model) {
			data.properties = model;
			postData($('#itemCreation'), 'POST', data, link, function(id) {
				if(amount > 0 && objId > 0) {
					objId = objId - 1;
					amount = amount - 1

					createItems(amount, objId);
				}
			});
		});

	} else {
		$(".successbox").fadeIn().delay(900).fadeOut();
		fileUploadLocation = new Array()
		goDeeper = false;
		workspace.navigate("#collections", {
			trigger : true
		}); 

	}

}

function loadEditData() {

	$(document).on("click",".pagination a",function(event){
		if($.isNumeric($(this).text())){
			$(this).parent().siblings().removeClass("active")
			$(this).parent().addClass("active")
			var page = Number($(this).text()) -1
		loadTopLevelData("?page="+page+"&amount=20");
		}
	})
	$(document).on("click", ".editRow", function() {
		loadData("/dev/objects/" + $(this).attr("data-id"), function(data) {
			console.log(data)
			emptyForm();
			fileUploadLocation = [];
			showItems([data])
			editItems = [data];
			workspace.navigate("#step2", {
				trigger : true
			});
			$(".items li:first a").trigger("click")

		});
	})

	$("#step2 form input").live("blur", function() {
		
		$(".items li.accordion-heading-focus").css({"background-color":"#9F111B"})
		var pos =$(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")
		createMetaDataModels("#singleData",function(data){
			editItems[pos].properties = data;
		})
		
	}); 
	

	$("#saveAll").click(function() {
		for(var i = 0; i < editItems.length; i++) {
			var link = socket + "/dev/objects/" + editItems[i]._id + "/update";
			var data = editItems[i];
			delete editItems[i]._id;
			updateData('POST', data, link, function(id) {
				loadEditObjects();
				$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
			})
		}
	})


	$("#goUp").click(function(event) {
		event.preventDefault();
		if($(this).is(':disabled') == false){
		history.back();
		}
	})
	$("#pidSelect").click(function(event) {
		event.preventDefault();
		var id = $('input[type=radio]:checked').attr("data-id");
		$("div.pId").text(id);
		$("#myModal").modal("hide");
		var pos =$(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")

		editItems[pos].parentId = id;
	})
	$("#pIdBtn").click(function() {
		loadpIdData();
	})
	$("#gblUpdate").click(function() {
		updateChildren(editItems);
	})
	$("#gblEdit").click(function(event) {
		event.preventDefault();
		$(".controls").hide();
		emptyForm();
		$("#boxFiles").remove();
		$(".items li").removeClass("accordion-heading-focus");
		$("#multi").show();
		$("#single").hide();
	})
	$('#checkAll').live('click', function() {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$("#step2Btn,#step2Btn2").click(function(event) {
		if($('tbody input:checked').size() > 0) {
			$(".controls").show();
			loadEditObjects();
			fileUploadLocation = [];
			
		} else {
			event.preventDefault();
		}

	})
}

function loadEditObjects() {
	var size = $('tbody input:checked').size()
	var arr = new Array();
	$(".pId").text("None");
	var objects = $('tbody input:checked');

	for(var i = 0; i < objects.length; i++) {
		loadData("/dev/objects/" + $(objects[i]).attr("data-id"), function(data) {
			arr.push(data);
			if(arr.length == size) {
				emptyForm();
				showItems(arr)
				editItems = arr;
				$(".items li:first a").trigger("click")
			}
		});

	};
}

function loadTopLevelData(query) {
	$('#loadingDiv').show()
	var link = "/dev/objects/"
	if(query){
		link += query
	}
	loadData(link, function(items,meta) {
		console.log(meta)
		createPagination(meta.numPages)
		$("tbody").empty();
		for(i in items) {
			var rbt = "<td><input name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>"
			if(window.location.pathname == "/create") {
				rbt = ""
				action = ""
			}
			$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td>"+action+"</tr>")
		}
		if(items.length == 0) {
			$("#step1 tbody").append("<tr><td colspan='5'>No objects available</td></tr>")
		}
		$('#loadingDiv').hide()
	});

}
function createPagination(numPages) {
	var pagination = $(".pagination ul")
	pagination.empty();

	pagination.append("<li><a><<</a></li>")

	for(var i = 1; i < numPages+1; i++) {
		var page = $(document.createElement('li'))
		if(i == 1){
			pagination.append("<li class='active'><a>"+i+"</a></li>")
		}else{
			pagination.append("<li><a>"+i+"</a></li>")
		}
		
			
	};

	pagination.append("<li><a>>></a></li>")

}

function loadpIdData() {
	loadData("/dev/objects", function(items) {
		$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			$(".modal tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td></tr>")
		}

	});

}

function loadPidChildren(id) {

	id = id.substring(2, id.length)

	loadData("/dev/objects/" + id + "/list", function(items) {
		$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>";
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td></tr>")
		}
		if(items.length == 0) {
			$(".modal tbody").append("<tr><td colspan='3'>No Children here</td></tr>")
		}
	});

}

function loadChildren(id) {
	$('#loadingDiv').show()
	id = id.substring(2, id.length)

	loadData("/dev/objects/" + id + "/list", function(items) {
		$("#step1 tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>"
			if(window.location.pathname == "/create") {
				rbt = ""
				action = ""
			}
			$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td><td>" + items[i].type + "</td>"+action+"</tr>")
		}
		$('#loadingDiv').hide()
		if(items.length == 0) {
			$("#step1 tbody").append("<tr><td colspan='4'>No Children here</td></tr>")
		}
	});

}

function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"edit" : "step2",
			"step2" : "step2", 
			"step3" : "step3",
			"step4" : "step4",
			"step5" : "step5",
			"collections" : "collection",
			"id:id" : "defaultRoute",
			"pd:id" : "loadPid",
			"myModal" : "loadPidTop",

		},

		step2 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step2,#step2Info,#single").show();
			$("#properties").show();
			loadpIdData();
			if(goDeeper) {
				goDeeper = false;
			} else {
				if($(".modal .breadcrumb li").size() >= 1) {
					$(".modal .breadcrumb li:last").remove();
					$("#goUp").attr("disabled", "disabled");
				}
			}
		},
		step3 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step3,#step3Info").show();
			$("#properties").show();

		},
		step4 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step4,#step4Info").show();
			$("#properties").show();

		},
		step5 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step5,#step5Info").show();

		},
		collection : function() {
			
			$("tbody").empty();
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			loadTopLevelData();
			resetCreatePage()
		},
		defaultRoute : function() {
			if(goDeeper) {
				$("form .breadcrumb a:last").parent().removeClass("active");
				$(".row .breadcrumb").append("<li class='active'><a href='"+Backbone.history.fragment+"'>" + parentType + ": " + currentParentName +"</a><span class='divider'>/</span></li>");
				goDeeper = false;
			} else {
				$(".row .breadcrumb li:last").remove();
				$("form .breadcrumb a:last").parent().addClass("active");
			}
			resetCreatePage();
			$("#createCollection").hide();
			loadChildren(Backbone.history.fragment);

		},
		loadPid : function() {
			if(goDeeper) {
				$(".modal .breadcrumb a:last").parent().removeClass("active");
				$(".modal .breadcrumb").append("<li class='active'><a href='"+Backbone.history.fragment+"'>" + parentType + ": " + currentParentName +"</a><span class='divider'>/</span></li>");
				$("#goUp").removeAttr("disabled");
				goDeeper = false;
			} else {
				$("#goUp").removeAttr("disabled");
				$(".modal .breadcrumb li:last").remove();
				$(".modal .breadcrumb a:last").parent().addClass("active");
				
			}
			loadPidChildren(Backbone.history.fragment);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}

function resetCreatePage() {
	$("#createCollection").show();
	$("#properties").hide()
	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
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
	$.ajax({
		url : socket + link,
		cache : false,
		type : "GET",
		dataType:"jsonp",
		success : function(data, status, r) {
			if(data.objects){
				callback(data.objects,data.meta);
			}else{
				callback(data);
			}
		},
		error : function(x, h, r) {
			console.log(x);
			console.log(h);
			console.log(r);
		}
	});

}

function postData(form, type, data, link, callback) {
	$.ajax({
		type : type,
		cache : false,
		data : data,
		url : link,
		success : function(id) {
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

function updateData(type, data, link, callback) {
	$.ajax({
		type : type,
		data : data,
		url : link,
		cache : false,
		success : function(id) {
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
