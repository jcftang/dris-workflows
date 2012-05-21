/*
 * @author Matthias Van Wambeke
 * ONLY the edit and create page use this file. For Admin page js please refer to admin-style.js
 */
//initiating variables
var workspace= backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""
var editItems = [];
var fileUploadLocation = new Array();
var navloc = new Array()
$(document).ready(function() {
	//enables xmlhttprequest
	jQuery.support.cors = true;
	//checks what page we are on
	switch(window.location.pathname) {
		case "/home":
			loadStatistics(0);
			break;
		case "/edit":
			workspace.navigate("", {
				trigger : true
			});
			loadEditData();
			break;
		case "/all":
			loadMediaData();
			break;
		case "/create":
			loadCreateData();
			workspace.navigate("", {
				trigger : true
			});
			break;
	}
	//Lets backbone know that we want to load the children
	//actual children are loaded from backbone
	$("tbody a").live("click", function(event) {
		goDeeper = true;
		parentType = $(this).attr("data-type");
		currentParentName = $(this).text()
	});
	//removes an element if you click on the "x"
	$(document).on("click",".close", function() {
		if(!$(this).hasClass("mdl"))
			$(this).parent().remove();
	});
});

//loads statistics in one by one, can otherwise not know what data is being loaded in.
function loadStatistics(numb) {
	if(numb == 0){
		$("#stats tbody").empty()
	}
	//stats to be loaded in, must equal name in the link
	var stats = ["all", "approved", "open"]
	if(numb <= stats.length - 1) {
		var item = stats[numb]
		var link = driPath +"stats/" + stats[numb]
		//there is no all link
		if(item == "all") {
			link = driPath +"stats/"
		}

		loadData(link, function(data) {
			$("#stats tbody").append("<tr><td>" + item + " objects</td><td>" + data + "</td>")
			numb++;
			loadStatistics(numb)
		})
	}
}

/*------------------------------------
 *           -- CREATE --
 *------------------------------------ */
function loadCreateData() {
	//settings for the file upload plugin
	$('#uploadFile').fileupload({
		forceIframeTransport : true,
		url : this.action,
		done : function(e, data) {
		}
	})
	$('#uploadFile').fileupload('option', 'redirect', window.location.href.replace(/\/[^\/]*$/, '/cors/result?'));
	createActions()

}



function createActions() {
	//goes to the create serie step and fills in the parent id
	$("#createSerie").live("click", function(event) {
		id = Backbone.history.fragment
		id = id.substr(3, id.length);
		//fills in the parent id
		$("#seriesCollection").val(id)
		emptyForm();
	});
	//fills in the parentid in the right input field and gets the value from the url
	$(document).on("click", "#createItems", function(event) {
		id = Backbone.history.fragment
		id = id.substr(3, id.length);
		$("#itemEditSelection").val(id)
		emptyForm();
	});
	//creates a set of items
	$("#createItemBtn").click(function(event) {
		event.preventDefault();
		var objId = $("#objectId").size();
		$(".successbox").fadeIn(100).text("Creating... Please wait.")
		if(objId > 0 && $("#step4 #objectId").val() != undefined) {
			insertItems();
		} else {
			var amount = $("#amount").val();
			createItems(amount, amount);
		}
	});
	//will create items for every media item
	$("#createMediaItem").click(function(event) {
		event.preventDefault();
		createMediaItem(fileUploadLocation)
	})
	
	$("#createMedia").live("click", function(event) {
		id = Backbone.history.fragment
		id = id.substr(3, id.length);
		//fills in the parent id
		$("#mediaParent").val(id)
		emptyForm();
	});

	//creates a new collection object
	$("#createCollectionBtn").click(function() {
		createCollection();
	})
	//creates a serie object
	$("#createSerieBtn").click(function() {
		createSeries()

	});
}

function createCollection() {
	var link = socket + driPath +"objects";

	var data = {
		"status" : "open",
		"type" : "collection",
		"properties" : {}
	};
	//checking if any files were uploaded
	if(fileUploadLocation.length > 0) {
		data.fileLocation = fileUploadLocation;
	}
	//gets the data out of the form in the correct json format
	createMetaDataModels("#collectionCreation", function(model) {
		data.properties = model;
		//sending the data to the server for creation
		postData($('#collectionCreation'), 'POST', data, link, function(id) {
			//incase of success
			$(".successbox").fadeIn().delay(900).fadeOut();
			fileUploadLocation = new Array()
			goDeeper = false;
			workspace.navigate("", {
				trigger : true
			});

		});
	});
}

function createSeries() {
	var link = socket + driPath +"objects";
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
			workspace.navigate("", {
				trigger : true
			});
		});
	});
}

function createMediaItem(file) {
	if(file.length > 0) {
		var link = socket + driPath +"objects";
		var parent = $("#mediaParent").val();
		var data = {
			"status" : "open",
			"type" : "item",
			"properties" : {},
			parentId : parent
		};
		if(parent == "") {
			delete data.parentId;
		}
		data.fileLocation = [file[0]];
		file.splice(0, 1)

		postData($('#itemCreation'), 'POST', data, link, function(id) {
			createMediaItem(file)
		});
	} else {
		$(".successbox").html("<strong>Success!</strong><br> <p>Creation successful.</p>").fadeIn().delay(1200).fadeOut();
		fileUploadLocation = new Array()
		goDeeper = false;
		workspace.navigate("", {
			trigger : true
		});
	}
}

// will insert items starting from a certain object id
function insertItems() {
	var objId = parseInt($("#step4 #objectId").val());
	loadData(driPath +"objects/" + $("#itemEditSelection").val() + "/list", function(data) {
		for(var i = 0; i < data.length; i++) {
			if(parseInt(data[i].properties.objectId) >= parseInt(objId)) {
				var link = socket + driPath +"objects/" + data[i]._id + "/update";
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
//will create items with a new object id
function createItems(itemAmount, objId) {
	amount = parseInt(itemAmount);
	objId = parseInt(objId);
	if(amount > 0 && objId > 0) {
		var link = socket + driPath +"objects";
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
		$(".successbox").html("<strong>Success!</strong><br> <p>Creation successful.</p>").fadeIn().delay(1200).fadeOut();
		fileUploadLocation = new Array()
		goDeeper = false;
		workspace.navigate("", {
			trigger : true
		});

	}

}


/*------------------------------------
 *           -- EDIT --
 *------------------------------------ */
//updates all the objects that were selected at step1 in the edit page
function updateChildren(data) {
	for(var i = 0; i < data.length; i++) {
		var link = socket + driPath +"objects/" + data[i]._id + "/update";
		var items = $('#globalData').serializeArray();
		//updating the properties of all the items that you selected
		for(var j = 0; j < items.length; j++) {
			var item = data[i];
			eval("item.properties." + items[j].name + "='" + items[j].value + "'");
		}
		//sending the new data to the server
		updateData('POST', {
			"properties" : data[i].properties
		}, link, function(id) {
		});
	}
	//displays the update message
	$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
}
function loadEditData() {
	$(document).on("click", ".editRow", function() {
		loadData(driPath +"objects/" + $(this).attr("data-id"), function(data) {
			emptyForm();
			fileUploadLocation = [];
			showItems([data])
			editItems = [data];
			workspace.navigate("#step2", {
				trigger : true
			});
			$(".breadcrumb a").not("form .breadcrumb a").parent().removeClass("active");
			$(".breadcrumb a").not("form .breadcrumb a").eq(1).parent().addClass("active");
			$(".items li:first a").trigger("click")

		});
	})

	$("#step2 form input").live("blur", function() {

		$(".items li.accordion-heading-focus").css({
			"background-color" : "#9F111B"
		})
		var pos = $(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")
		createMetaDataModels("#singleData", function(data) {
			editItems[pos].properties = data;
		})
	});

	$("#saveAll").click(function() {
		for(var i = 0; i < editItems.length; i++) {
			var link = socket + driPath +"objects/" + editItems[i]._id + "/update";
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
		if($(this).is(':disabled') == false) {
			history.back();
		}
	})
	$("#pidSelect").click(function(event) {
		event.preventDefault();
		var id = $('input[type=radio]:checked').attr("data-id");
		$("div.pId").text(id);
		$("#myModal").modal("hide");
		var pos = $(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")

		editItems[pos].parentId = id;
	})
	$("#pIdBtn").click(function() {
		$('#myModal').modal()
		workspace.navigate("#myModal", {
			trigger : true
		});
		loadpIdData(1, itemsPerPage);
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
			$(".breadcrumb a").not("form .breadcrumb a").parent().removeClass("active");
			$(".breadcrumb a").not("form .breadcrumb a").eq(1).parent().addClass("active");
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
		loadData(driPath +"objects/" + $(objects[i]).attr("data-id"), function(data) {
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
/*------------------------------------
 *           -- Data Load --
 *------------------------------------ */

function loadTopLevelData(page, amount) {
	$("tbody").empty();
	createLoadingRow();
	var link = driPath +"objects?page=" + (page - 1) + "&amount=" + amount

	loadData(link, function(items, meta) {
		$('#loadingDiv').hide()
		$("tbody").empty();
		createPagination(meta)

		for(i in items) {
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var checkbox = "<td><input name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>"
			if(window.location.pathname == "/create") {
				checkbox = ""
				action = ""
			}

			var title = "-"
			if(( typeof items[i].properties.titleInfo[0]) != "undefined") {
				title = items[i].properties.titleInfo[0].title;
			}
			if(( typeof items[i].fileLocation) != "undefined" && ( typeof items[i].properties.titleInfo[0]) == "undefined") {
				var nameStart = items[i].fileLocation[0].indexOf("/") + 1;
				title = items[i].fileLocation[0].substring(nameStart);
			}

			$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + checkbox + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + title + "</a></td><td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td>" + action + "</tr>")
		}
		if(items.length == 0) {
			$("#step1 tbody").append("<tr><td colspan='5'>No objects available</td></tr>")
			$('#loadingDiv').hide()
		}

	}, function(err) {
		$('#loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('#loadingDiv').append(td)
	});

}

function loadpIdData(page,amount) {
	var link = driPath +"objects?page=" + (page - 1) + "&amount=" + amount

	loadData(link, function(items, meta) {
		createPagination(meta)
		$(".modal tbody").empty();
		
		for(i in items) {
			var rbt = "<td><input name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var title = "-"
			if((typeof items[i].properties.titleInfo[0]) != "undefined" ) {
				title = items[i].properties.titleInfo[0].title;
			}
			if((typeof items[i].fileLocation) != "undefined" && (typeof items[i].properties.titleInfo[0]) == "undefined"  ){
			var nameStart = items[i].fileLocation[0].indexOf("/") +1;
			title = items[i].fileLocation[0].substring(nameStart);
		}
			$(".modal tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + title + "</a></td><td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" +label+"</a></td><td>" + items[i].type + "</td></tr>")
		}

	});

}

function loadPidChildren(id, page, amount) {
	var link = driPath +"objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	loadData(link, function(items, meta) {
		createPagination(meta)
		$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>";
			var title = "-"
			if(( typeof items[i].properties.titleInfo[0]) != "undefined") {
				title = items[i].properties.titleInfo[0].title;
			}
			if(( typeof items[i].fileLocation) != "undefined" && ( typeof items[i].properties.titleInfo[0]) == "undefined") {
				var nameStart = items[i].fileLocation[0].indexOf("/") + 1;
				title = items[i].fileLocation[0].substring(nameStart);
			}
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + title + "</a></td><td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td></tr>")
		}
		if(items.length == 0) {
			$(".modal tbody").append("<tr><td colspan='5'>No Children here</td></tr>")
		}
	});

}

function loadChildren(id, page, amount) {
	$("tbody").empty();
	createLoadingRow();
	var link = driPath +"objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	loadData(link, function(items, meta) {
		$("tbody").empty();
		if(items.length == 0) {
			createPagination(meta)
			$("#step1 tbody").append("<tr><td colspan='5'>No Children here</td></tr>")
		} else {
			createPagination(meta)
			for(i in items) {
				var rbt = "<td><input  name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
				var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>"
				var label = "IN-" + items[i].label.substring(0, amountLblChars);
				if(window.location.pathname == "/create") {
					rbt = ""
					action = ""
				}
				var title = "-"
				if(( typeof items[i].properties.titleInfo[0]) != "undefined") {
					title = items[i].properties.titleInfo[0].title;
				}
				if(( typeof items[i].fileLocation) != "undefined" && ( typeof items[i].properties.titleInfo[0]) == "undefined") {
					var nameStart = items[i].fileLocation[0].indexOf("/") + 1;
					title = items[i].fileLocation[0].substring(nameStart);
				}

				$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + title + "</a></td><td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td>" + action + "</tr>")
			}

		}

		$('#loadingDiv').hide()

	}, function(err) {
		$('#loadingDiv').empty()
		var td = $(document.createElement('td'))
		td.attr('colspan', '6')
		td.addClass('alert-error')
		td.text(err)
		$('#loadingDiv').append(td)
	});

}

/*------------------------------------
 *           -- Backbone --
 *------------------------------------ */

function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"edit" : "step2",
			"myModal/:page" : "loadPidTop2",
			"step2" : "step2", // #search/kiwis
			"step3" : "step3",
			"step4" : "step4",
			"step5" : "step5",
			"pd/:id" : "loadPid",
			"/:page" : "collectionPage",
			"id/:id" : "defaultRoute",
			"id/:id/:page" : "pageRoute",
			"pd/:id/:page" : "pageRoutePid",
			"myModal" : "loadPidTop",
			"" : "collection",
		},

		step2 : function() {
			console.log("step2")
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
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
			console.log("step3")
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step3,#step3Info").show();
			$("#properties").show();

		},
		step4 : function() {
			console.log("step4")
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step4,#step4Info").show();
			$("#properties").show();

		},
		step5 : function() {
			console.log("step5")
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step5,#step5Info").show();

		},
		collection : function() {
			console.log("lodaing")
			$("tbody").empty();
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			loadTopLevelData(1, itemsPerPage);
			resetCreatePage()
		},
		collectionPage : function(page) {
			console.log("coll2")
			//console.log("page" + page)
			loadTopLevelData(page, itemsPerPage);
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:last").remove();
				}
			}
			goDeeper = false;
		},
		defaultRoute : function(id) {
			console.log("defaultRoute")
			if(goDeeper) {
				$("form .breadcrumb a:last").parent().removeClass("active");
				$(".row .breadcrumb").append("<li class='active'><a href='#id/" + id + "'>" + parentType + ": " + currentParentName + "</a><span class='divider'>/</span></li>");
				goDeeper = false;
			} else {
				$(".row .breadcrumb li:last").remove();
				$("form .breadcrumb a:last").parent().addClass("active");
			}
			resetCreatePage();
			$("#createCollection").hide();
			loadChildren(id, 1, itemsPerPage);

		},
		loadPidTop : function() {
			$(".modal  tbody").empty();
			if(!goDeeper) {
				if($(".modal .breadcrumb li").size() > 1) {
					$(".modal  .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			loadpIdData(1, itemsPerPage);
		},
		loadPidTop2 : function(page) {
			$(".modal  tbody").empty();
			if(!goDeeper) {
				if($(".modal .breadcrumb li").size() > 1) {
					$(".modal  .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			loadpIdData(page, itemsPerPage);
		},
		loadPid : function(id) {
			if(goDeeper) {
				$(".modal .breadcrumb a:last").parent().removeClass("active");
				$(".modal .breadcrumb").append("<li class='active'><a href='#pd/" + id + "'>" + parentType + ": " + currentParentName + "</a><span class='divider'>/</span></li>");
				$("#goUp").removeAttr("disabled");
				goDeeper = false;
			} else {
				$("#goUp").removeAttr("disabled");
				$(".modal .breadcrumb li:last").remove();
				$(".modal .breadcrumb a:last").parent().addClass("active");
			}
			loadPidChildren(id, 1, itemsPerPage);
		},
		pageRoute : function(id, page) {
			//console.log(page)
			loadChildren(id, page, itemsPerPage);
		},
		pageRoutePid : function(id, page) {
			//console.log(page)
			loadPidChildren(id, page, itemsPerPage);
		},
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}

function resetCreatePage() {
	$("#createCollection").show();
	$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
	$("#step1").show();
	$("#properties").hide();
}


/*------------------------------------
 *           -- Ajax Calls --
 *------------------------------------ */

function postData(form, type, data, link, callback) {
	$.ajax({
		type : type,
		cache : false,
		data : data,
		url : link,
		success : function(id) {
			workspace.navigate("", {
				trigger : true
			});
			if(callback != undefined) {
				callback(id);
			}
		},
		error : function(x, h, r) {
			console.log(x);
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
		}
	})
	return false;
}
