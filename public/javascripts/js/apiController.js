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
		case "/compare":
			workspace.navigate("", {
				trigger : true
			});
			break;
	}

	$("tbody a").live("click", function(event) {
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
			id = id.substr(3, id.length);
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
				workspace.navigate("", {
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
				workspace.navigate("", {
					trigger : true
				});
			});
		});

	}); 


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
		$(".successbox").html("<strong>Success!</strong><br> <p>Creation successful.</p>").fadeIn().delay(1200).fadeOut();
		fileUploadLocation = new Array()
		goDeeper = false;
		workspace.navigate("", {
			trigger : true
		}); 

	}

}


function loadEditData() {
	$(document).on("click", ".editRow", function() {
		loadData("/dev/objects/" + $(this).attr("data-id"), function(data) {
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
		$('#myModal').modal()
		workspace.navigate("#myModal", {
				trigger : true
			});
		loadpIdData(1,itemsPerPage);
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

function loadTopLevelData(page, amount) {
	$("tbody").empty();
	createLoadingRow();
	var link = "/dev/objects?page=" + (page-1) + "&amount=" + amount
	
	loadData(link, function(items,meta) {
		createPagination(meta)
		$("tbody").empty();
		for(i in items) {
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var rbt = "<td><input name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>"
			if(window.location.pathname == "/create") {
				rbt = ""
				action = ""
			}

			var title = "-"
			if(items[i].properties.titleInfo != undefined) {
				title = items[i].properties.titleInfo[0].title;
			}

			$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + title + "</a></td><td>"+label+"</td><td>" + items[i].type + "</td>"+action+"</tr>")
		}
		if(items.length == 0) {
			$("#step1 tbody").append("<tr><td colspan='5'>No objects available</td></tr>")
		}
		$('#loadingDiv').hide()
		
	},function(err){
		$('#loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('#loadingDiv').append(td)
	});

}
function createLoadingRow(){	
	var tr = $("<tr>").attr('id', 'loadingDiv')
	var loading = $('<i>').addClass('icon-refresh')
	
	var td = $("<td>").attr('colspan', '5').append(loading).text(" Loading...");
	tr.append(td)
	
	$('tbody').append(tr)
}


function createPagination(meta) {
	var startPage;
	var endPage;
	var currentPage = parseInt(meta.page) + 1

	//checks gives the ten value
	var start = Math.floor(currentPage / amountPages) * amountPages
	//if the page number is higher then 10
	if(start > 0) {
		//checks if the difference between the currentPage and the last page
		//is bigger then half of the amount of pages displayed
		if((meta.numPages - currentPage) > (amountPages / 2)) {
			startPage = currentPage - Math.floor(amountPages / 2);
			endPage = currentPage + Math.floor(amountPages / 2);
		} else {
			startPage = currentPage - Math.floor(amountPages / 2);
			endPage = meta.numPages;
		}
	} else {
		//checks if the currentpage is higher then the middle value of the pages in the bar
		if((start + amountPages - currentPage) < (start + amountPages / 2)) {
			var diff = Math.floor(amountPages / 2 - (amountPages - currentPage))
			startPage = start + diff
			endPage = start + diff + amountPages;
		} else {
			startPage = 1;
			endPage = amountPages;
		}
	}

	var pagination = $(".pagination ul").empty();
	var pos = Backbone.history.fragment.indexOf('/')

	var id = Backbone.history.fragment.substring(0, pos)

	if(pos == -1) {
		id = Backbone.history.fragment
	}
	if(id == "id" || id == "pd") {

		if(Backbone.history.fragment.lastIndexOf('/') > 2) {
			id += Backbone.history.fragment.substring(pos, Backbone.history.fragment.lastIndexOf('/'))
		} else {
			id += Backbone.history.fragment.substr(pos)
		}
	}

	if(meta.numPages < 2) {
		return
	}

	// Create pagination

	// Add general back button
	var a = $("<a>").text("<<").attr('href', '#' + id + "/" + (currentPage - 1))
	var goBack = $("<li>").append(a);
	if(currentPage < 2) {
		goBack.addClass('disabled')
		a.click(function(e) {
			e.preventDefault();
		})
	}
	pagination.append(goBack)
	if(startPage > 1) {
		var li = $("<li>")
		var a = $("<a>").attr('href', '#' + id + "/" + 1).text(1)
		li.append(a);
		pagination.append(li);
		pagination.append($("<li><a>...</a></li>"))
	}
	// Add pages
	for(var i = startPage; i <= endPage; i++) {
		var pagecntrl = $("<li>")
		var a = $("<a>")
		if(i == currentPage) {
			pagecntrl.addClass('active')
			a.click(function(event) {
				event.preventDefault();
			})
		}
		a.attr('href', '#' + id + "/" + i).text(i)
		pagecntrl.append(a)
		pagination.append(pagecntrl)
	};

	if((meta.numPages - currentPage) > (amountPages / 2)) {
		pagination.append($("<li><a>...</a></li>"))
		var li = $("<li>")
		var a = $("<a>").attr('href', '#' + id + "/" + meta.numPages).text(meta.numPages)
		li.append(a);
		pagination.append(li);
	}

	// Add general forward button
	var a = $("<a>").text(">>").attr('href', '#' + id + "/" + (currentPage + 1))
	var goForward = $("<li>").append(a);
	if(meta.page > (meta.numPages - 2)) {
		goForward.addClass('disabled')
		a.click(function(e) {
			goDeeper = true;
			e.preventDefault();
		})
	}
	pagination.append(goForward)
}


function loadpIdData(page,amount) {
	var link = "/dev/objects?page=" + (page - 1) + "&amount=" + amount

	loadData(link, function(items, meta) {
		createPagination(meta)
		$(".modal tbody").empty();
		
		for(i in items) {
			var rbt = "<td><input name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var title = "-"
			if(items[i].properties.titleInfo != undefined) {
				title = items[i].properties.titleInfo[0].title;
			}
			$(".modal tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + title + "</a></td><td>"+label+"</td><td>" + items[i].type + "</td></tr>")
		}

	});

}


function loadPidChildren(id,page,amount) {
   var link = "/dev/objects/" + id + "/list?page=" + (page-1) + "&amount=" + amount
	loadData(link, function(items,meta) {
		createPagination(meta)
		$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>";
			var title = "-"
			if(items[i].properties.titleInfo != undefined) {
				title = items[i].properties.titleInfo[0].title;
			}
			$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + title+ "</a></td><td>"+label+"</td><td>" + items[i].type + "</td></tr>")
		}
		if(items.length == 0) {
			$(".modal tbody").append("<tr><td colspan='5'>No Children here</td></tr>")
		}
	});

}


function loadChildren(id, page, amount) {
	$("tbody").empty();
	createLoadingRow();
	var link = "/dev/objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
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
					if(items[i].properties.titleInfo != undefined) {
						title = items[i].properties.titleInfo[0].title;
					}
					$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + title + "</a></td><td>"+label+"</td><td>" + items[i].type + "</td>" + action + "</tr>")
				}
		}

		$('#loadingDiv').hide()

	},function(err){
		$('#loadingDiv').empty()
		var td = $(document.createElement('td'))
		td.attr('colspan', '6')
		td.addClass('alert-error')
		td.text(err)
		$('#loadingDiv').append(td)
	});

}

function loadCompareData(id){
	console.log("Comparing " + id)
	var link = "/dev/objects/" + id + "/compare"
	loadData(link, function(data) {
		console.log(data)
		$('#mongoData').text(JSON.stringify(data.mongo, undefined, 4))
		$('#fedoraData').text(data.fedora)
	},function(err){
		console.log(err)
	});
}


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
			"/:page" : "collection2",
			"id/:id" : "defaultRoute",
			"id/:id/:page" : "pageRoute",
			"pd/:id/:page" : "pageRoute2",
			"myModal" : "loadPidTop",
			"" : "collection",
			"compare/:id" : "compare"
		},

		step2 : function() {
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
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step3,#step3Info").show();
			$("#properties").show();

		},
		step4 : function() {
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step4,#step4Info").show();
			$("#properties").show();

		},
		step5 : function() {
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
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
			loadTopLevelData(1, itemsPerPage);
			resetCreatePage()
		},
		collection2 : function(page) {
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
			//console.log("defaultRoute")
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
		pageRoute2 : function(id, page) {
			//console.log(page)
			loadPidChildren(id, page, itemsPerPage);
		},
		compare : function(id, page) {
			loadCompareData(id)
		}

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
/*
 * Loads in any data
 */
function loadData(link, callback, error) {
	$.ajax({
		url : socket + link,
		cache : false,
		type : "GET",
		dataType:"jsonp",
		timeout:2000,
		success : function(data, status, r) {
			if(data.objects){
				callback(data.objects,data.meta);
			}else{
				callback(data);
			}
		},
		error : function(x, h, r) {
			if(r == "timeout") {
				error("Connection to the API could not be established")
			} else {
				error(x)
			}
			console.log(x);
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
