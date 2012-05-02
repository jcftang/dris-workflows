/**
 * @author Matthias Van Wambeke
 *
 *
 */

//starts when the main html file is loaded
$(document).ready(function() {


	$('#upload').live('change', function() {
		$("#preview").html('');
		$("#preview").html('<img src="loader.gif" alt="Uploading...."/>');
		$("#imageform").ajaxForm({
			target : '#preview'
		}).submit();
	}); 


	
	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();

	loadBtnActions();
	switch(window.location.pathname) {
		case "/edit":
			editAction();
			break;
		case "/all":
			loadMediaData();
			break;
	}

});


function uploadFile() {
	var file = $("[name='upload']")[0].files[0]
	console.log(file)
	var fd = new FormData();
	fd.append('file', file);

	$.ajax({
		url : socket + port + "/dev/upload",
		data : fd,
		cache : false,
		dataType : "jsonp",
		contentType : false,
		processData : false,
		type : 'POST',
		success : function(data) {
			alert(data);
		}
	})
}


function loadMediaData() {
	$('#checkAll').click(function() {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$('#bulk-execute').click(function() {
		var action = $(this).prev().val();
		switch(action) {
			case "remove":
				removeAllSelected();
				$(this).prev().val("-1");
				break;
		}
	});

}

/* Function: editActions

 Loads actions for the edit page
 */
function editAction() {

	$("form").not("#step1 form").sortable({
		items : 'div.control-group'
	});
	//loadAllItems();
	//hides the box which allows users to upload files
	$("#fileBox").hide();

	//Highlights the selected item in the list
	$(".items li a").live("click", function() {
		$(".items li").removeClass("accordion-heading-focus");
		$(this).parent().addClass("accordion-heading-focus");
		//highlights the same item in the other steps (when switching between step 2 and 3)
		$(".items li").eq($(this).parent().index()).addClass("accordion-heading-focus");
		$("#list2 li").eq($(this).parent().index()).addClass("accordion-heading-focus");
	})
}


	function removeAllSelected() {
		var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
		if(confirmDialog == true) {
			$('tbody input:checked').each(function() {
				removeItem($(this).attr("data-id"), function(id) {
					$("#" + id).remove();
				})
			});
		}

	}


function removeItem(id, callback) {
	$.ajax({
		url : "/object/media/" + id + "/remove",
		success : function(data) {
			callback(id);
		},
		error : function(d, r) {
			console.log(d);
			console.log(r);
		}
	});
}

/*
 Function: loadAllItemsByType

 loads all the items of a cetain type(series,collections,items)

 Parameters:

 type - type of the item (series,collections or items)
 callback - the function to return it to

 /*
 Function: showItems

 loads the items that are connected to a certain parentId

 Parameters:

 items - an array which contains all the items to dispay. These items are the parent's object children.
 */
function showItems(items) {
	var root = "";
	$(".items ul").empty();

	for(var i = 0; i < items.length; i++) {
		console.log(items[i])
		root += "<li data-pos='" + i + "'><a data-type='" + items[i].type + "'  href='" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + " " + items[i]._id + "</a></li>";
		if(i == items.length - 1) {
			console.log(root)
			$(".items ul").append(root);
		}

	}

}


function fillUpForm(data) {

	$(".dataform").empty();
	var position = 0;
	for(var i in data.properties) {
		for(var j in data.properties[i]) {
			var info = data.properties[i][j]
			addEditFormFields(info,i);
			for(i in info) {
				$("#" + $('[name="' + i + '"]:last').attr("id")).val(info[i])
				if( typeof info[i] == "object") {
					$("#" + $(".dataform ul:last").attr("id")).empty()
					fillInSpecialDataFields(info[i],i)
				}
			}

		}
		position++;
	}
	if(data.parentId) {
		$("div.pId").text(data.parentId)
	}
}





function fillInSpecialDataFields(info,name) {
	for(var i in info) {
		var spField = $(addSpecialField(name))

		for(j in info[i]) {
			$('[name="' + j + '"]', spField).val(info[i][j]);

			//$("#" + $('.dataform ul:last li:last [name="' + j + '"]:last').attr("id")).val(info[i][j])

		}
		$("#"+$(".dataform ul:last").attr("id")).append(spField)

	}
}



var counter = 100
function loadBtnActions(){
	//Triggers when there is an option/input that needs to be added to the form
	$("#properties button").click(function() {
		if($(this).text() == "objectId") {
			addProjectField($(this))
		} else {
			addInputFieldToFrom($(this).index(),optionsArray);
		}

	});
	//when clicking a dropdown section it makes it "highlighted"
	$(".accordion-heading").click(function() {
		$(".accordion-heading").removeClass("accordion-heading-focus");
		$(this).addClass("accordion-heading-focus");
	})

	$(".breaddisabled").click(function() {
		return false
	});

	$(".breadcrumb li a").live("click", function() {
		$(".breadcrumb a").parent().removeClass("active");
		$(this).parent().addClass("active");
	});
	$(".pager a").click(function() {

		$(".breadcrumb a").parent().removeClass("active");
		link = $(this).attr("href");
		$(".breadcrumb").find("a").each(function(index) {
			if($(this).attr("href") == link) {
				$(this).removeClass("breaddisabled")
				$(this).parent().addClass("active");
			}
		});
	});
	$("#surcheck").click(function() {
		$("#fileBox").toggle();
	})

	$("#editItem1,#editItem2").click(function(event) {
		if(window.location.pathname == "/edit") {
			var data = {
				"properties" : {},
			};
			var pos = $(".items li.accordion-heading-focus").attr('data-pos');
			if(editItems[pos].parentId) {
				data.parentId = editItems[pos].parentId
			}
			createMetaDataModels("#singleData", function(model) {
				var link = socket + "/dev/objects/" + $(".items li.accordion-heading-focus").find("a").attr("href") + "/update";
				data.properties = model
				updateData('POST', data, link, function(id) {
					$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
				})
			})
		}
	})

	$(".addInput").live("click",function(event){

		event.preventDefault();
		$(this).next().append(addSpecialField($(this).attr("data-type")));
	})

	$('#step3EditBtn').click(function() {
		loadAllImages($("input[name='_id']").val());
	})

	$(".items #list2 li a").live("click", function(event) {
		$(".controls").show();
		event.preventDefault();
		$("#multi").hide();
		$("#single").show();
		var pos = $(this).parent().attr("data-pos");
		if(editItems[pos]) {
			fillUpForm(editItems[pos]);
		}
		loadAllImages($(this).attr("href").substring($(this).attr("href").indexOf("/") + 1));
	});
	$(".items ul li a").live("click", function(event) {
		$(".controls").show();
		event.preventDefault();
		$("#multi").hide();
		$("#single").show();
		var link = "/dev/objects"
		if($.browser.msie) {
			link = "/dev/objects/"
		}
		var pos = $(this).parent().attr("data-pos");
		if(editItems[pos]) {
			fillUpForm(editItems[pos]);
		}

	});

	$("#createItems").live("click", function(event) {
		id = Backbone.history.fragment
		if(id != "collections") {
			id = id.substr(2, id.length);
			$("#itemEditSelection").val(id)
		}
		emptyForm();
	});

	$("#createCollection,#createSerie,#createItems").live("click", function(event) {
		$("#successbox").hide();
		emptyForm();
	});

	$(".nextItemBtn").click(function() {
		loadNexItemInList()
	})

	$(".previousItemBtn").click(function() {
		loadPrevItemInList();
	})
}

function loadNexItemInList() {
	$(".controls").show();
	urlNextItem = $(".items li.accordion-heading-focus").next().find("a").attr("href");
	nextItem = $(".items li.accordion-heading-focus").next();
	if(!nextItem.is("li")) {
		nextItem = $(".items li:first");
		urlNextItem = $(".items li:first").find("a").attr("href");
	}
	$("#list2 li").eq(nextItem.index()).addClass("accordion-heading-focus");
	nextItem.siblings().removeClass("accordion-heading-focus");
	nextItem.addClass("accordion-heading-focus");
	loadData("/dev/objects/" + urlNextItem, function(data) {
		fillUpForm(data)
	});
}

function loadPrevItemInList() {
	$(".controls").show();
	urlPrevItem = $(".items li.accordion-heading-focus").prev().find("a").attr("href");
	prevItem = $(".items li.accordion-heading-focus").prev();
	if(!prevItem.is("li")) {
		prevItem = $("#step2Info  .items li:last");
		urlPrevItem = $("#step2Info .items li:last").find("a").attr("href");
	}
	$("#list2 li").eq(prevItem.index()).addClass("accordion-heading-focus");
	prevItem.siblings().removeClass("accordion-heading-focus");
	prevItem.addClass("accordion-heading-focus");
	loadData("/dev/objects/" + urlPrevItem, function(data) {
		fillUpForm(data)
	});
}

function emptyForm() {
	$(".dataform").empty();
}


function addInputFieldToFrom(index,dataObject){

	var root = '<div id="' + dataObject[index].name + '"class="formInput">'
	root += '<h3>' + dataObject[index].name + '</h3>'
	root += '<a class="close" data-dismiss="alert" href="#">&times;</a><hr>'
	for(var i in dataObject[index].value) {

		root += '<div class="control-group"><label class="control-label">' +i + '</label>';
		if(checkSpecialField(i)){
			root += '<a class="close" data-dismiss="alert" href="#">&times;</a>';	
			root += "<div class='controls'><button class='btn addInput' data-type='"+i+"'>Add " + i +"</button>";
			root += '<ul data-name="'+i+'" id="ul'+counter+'">'+addSpecialField(i)+'</ul>';
		} else if(checkSingleField(i)) {
			root += '<div class="controls">';
			root += addSpecialField(i);
			root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a>';
		} else {
			root += '<div class="controls"><input type="text" id="' + i + counter + '" name="' + i + '" class="input-xlarge" />';
			root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
		}
	}

	root +="</div>"
	counter++;

	$(".dataform").append(root);
	console.log($(".dataform"))
}



function addEditFormFields(dataObject, name) {
	console.log(dataObject)
	var root = '<div id="' + name + '"class="formInput">'
	root += '<h3>' + name + '</h3>'
	root += '<a class="close" data-dismiss="alert" href="#">&times;</a><hr>'

	for(var j in optionsArray) {
		console.log(optionsArray[j])
		for(var i in optionsArray[j].value) {
			if(optionsArray[j].name == name) {
				root += '<div class="control-group"><label class="control-label">' + i + '</label>';
				if(checkSpecialField(i)) {
					root += '<a class="close" data-dismiss="alert" href="#">&times;</a>';
					root += "<div class='controls'><button class='btn addInput' data-type='" + i + "'>Add " + i + "</button>";
					root += '<ul data-name="' + i + '" id="ul' + counter + '">' + addSpecialField(i) + '</ul>';
				} else if(checkSingleField(i)) {
					root += '<div class="controls">';
					root += addSpecialField(i);
					root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a>';
				} else {
					root += '<div class="controls"><input type="text" id="' + i + counter + '" name="' + i + '" class="input-xlarge" />';
					root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
				}
			}
		}
	}

	root += "</div>"
	counter++;

	$(".dataform").append(root);
}



function loadAllImages(id) {
	$("#imageContainer").empty();
	loadData("object/media/" + id + "/list", function(data) {
		for(var file in data) {
			$("#imageContainer").append("<img src='object/media/" + data[file]._id + "/get'>")
		}
	});
}

function checkSpecialField(name) {
	if(name == "role" || name == "place" || name == "internetMediaType" || name == "topic" || name == "name" || name == "identifier") {
		return true;
	}
	return false;
}

function checkSingleField(name) {
	if(name == "typeOfResource" || name == "genre" || name == "digitalOrigin" || name == "abstract" || name == "note") {
		return true;
	}
	return false;
}

function addSpecialField(name) {
	console.log(name)
	counter++
	removebtn = '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>'
	switch(name) {
		case "role":
			return "<li data-type='role'><div class='inputBox'><select class='input-small' name='role'  id='input"+counter+"' ><option value='text'>text</option>" 
			+ "<option value='code'>code</option></select>"
			+ "<label>Authority</label><input id='input"+counter+"a' name='authority' type='text' class='input-small'>" + removebtn + "</div></li> ";
			break;
		case "typeOfResource":
			return createSelect(resourceTypes, name);
			break;
		case "genre":
			return "<label>type</label><input id='input"+counter+"' name='type' type='text' class='input-small'>"
			+"<label>Authority</label><input  id='input"+counter+"a' name='authority' type='text' class='input-small'>";
			break
		case "place":
			return "<li><div class='inputBox'><select id='input"+counter+"' class='input-small'><option value='text'>text</option>" 
			+ "<option value='code'>code</option></select>"
			+"<label>Authority</label><input id='input"+counter+"a' name='authority' type='text' class='input-small'>" + removebtn + "</div></li> ";
			break;
		case "digitalOrigin":
			return createSelect(physicalDescriptionObjects, name)
			break;
		case "internetMediaType":
		 	return "<li class='dummy'><div class='inputBox'><label>Type:</label><input id='input"+counter+"a' type='text' name='mediaType'>" + removebtn + "</div></li> ";
			break;
		case "abstract":
			return "<textarea  id='input"+counter+"' rows='5' cols='50'></textarea>";
			break
		case "note":
			return "<textarea  id='input"+counter+"'  rows='5' cols='50'></textarea>";
			break
		case "topic":
			return "<li class='dummy'><div class='inputBox'><label>Topic:</label><input id='input"+counter+"' type='text' name='topic'>" + removebtn + "</div></li> ";
			break;
		case "name":
			return "<li><div class='inputBox'>"+ createSelect(nameObjects, name) +"<input id='input"+counter+"' type='text'>"+ removebtn + "</div></li>";
			break;
		case "identifier":
			return "<li class='dummy'><div class='inputBox'><label>type</label><input id='input"+counter+"a' name='type' type='text' class='input-small'>"
			+"<label>value</label><input id='input"+counter+"' name='value' type='text' class='input-small'>" + removebtn + "</div></li> ";
			break;
	}
}

function createSelect(items, name) {
	var root = "<select name='" + name + "' id='select"+counter+"'>"
	for(var i = 0; i < items.length; i++) {
		root += "<option>" + items[i] + "</option>";
	}
	root += "</select>"
	return root;
}



function createMetaDataModels(form,callback) {
	var dataBlocks = $(".dataform > div",form);
	Model = Backbone.Model.extend();

	var dataModel = new Model();
	var parent = new Object();
	for(var k = 0; k < dataBlocks.length; k++) {
		var b = new Object();
		console.log(parent[$(dataBlocks[k]).attr("id")])
		if(parent[$(dataBlocks[k]).attr("id")] == undefined) {
			parent[$(dataBlocks[k]).attr("id")] = new Array();
		}
		console.log(parent)
		console.log(dataBlocks[k])
		var fields = $("input,select,textarea", dataBlocks[k]).not("ul input, ul select");
		console.log(fields)
		for(var i = 0; i < fields.length; i++) {
			if($(fields[i]).val() != "") {
				b[$(fields[i]).attr("name")] = $(fields[i]).val();
			}
		}
		var lists = $("ul", dataBlocks[k])
		for(var j = 0; j < lists.length; j++) {
			var items = $("li", lists[j])
			var itemsArray = [];
			for(var i = 0; i < items.length; i++) {
				var obj = new Object();
				var selects = $("select", items[i])
				for(var l = 0; l < selects.length; l++) {
					obj[$(selects[l]).attr("name")] = $(selects[l]).val();
					obj[$(selects[l]).attr("name")] = $(selects[l]).val();
				}
				var selects = $("input", items[i])
				for(var m = 0; m < selects.length; m++) {
					obj[$(selects[m]).attr("name")] = $(selects[m]).val();
					obj[$(selects[m]).attr("name")] = $(selects[m]).val();
				}
				itemsArray.push(obj)
			}
			b[$(lists[j]).attr("data-name")] = itemsArray;
		}
		parent[$(dataBlocks[k]).attr("id")].push(b);
		console.log(parent[$(dataBlocks[k]).attr("id")])
		dataModel.set(parent);
		console.log()
	}
	callback(dataModel.toJSON());
}

function addProjectField(obj) {
	var s = "#" + $(obj).text()
	var objects = $(s)
	if(objects.length == 0) {
		var root = '<div class="control-group"><label class="control-label">' + $(obj).text() + '</label>';
		root += '<div class="controls"><input type="text" id="' + $(obj).text() + '" name="' + $(obj).text() + '" class="input-xlarge" />';
		root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
		$(".dataform").append(root);
	}
}

