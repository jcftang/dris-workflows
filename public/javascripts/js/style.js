/**
 * @author Matthias Van Wambeke
 *
 *
 */

//starts when the main html file is loaded
$(document).ready(function() {
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
	$(document).on("click",".items li a", function(event) {
		event.preventDefault();
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
		root += "<li data-pos='" + i + "'><a data-type='" + items[i].type + "'  href='" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + " " + items[i]._id + "</a></li>";
		if(i == items.length - 1) {
			$(".items ul").append(root);
		}

	}

}

var itemPos = 0;
function fillUpForm(data) {

	$(".dataform").empty();
	var position = 0;
	for(var i in data.properties) {
		var item = i;
		for(var j in data.properties[i]) {
			
			var info = data.properties[item][j]
			addEditFormFields(info,item);
			for(i in info) {
				$("#" + $('[name="' + i + '"]:last').attr("id")).val(info[i])
				if( typeof info[i] == "object") {
					$.fn.reverse = [].reverse; 
					$(".dataform ul").eq(itemPos).empty()
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
		$.fn.reverse = [].reverse; 
		
		$(".dataform ul").eq(itemPos).append(spField);
		itemPos++;

	}
}



var counter = 100
function loadBtnActions(){
	//Triggers when there is an option/input that needs to be added to the form
	$(".accordion-heading")
	$("#properties button").click(function(event) {
		event.preventDefault()
		if($(this).text() == "objectId" || $(this).text() == "upload"  ) {
			addProjectField($(this))
		} else {
			addInputFieldToFrom($(this).index(),optionsArray);
		}

	});
	$("#properties a").click(function(event) {event.preventDefault()})
	//when clicking a dropdown section it makes it "highlighted"
	$(".accordion-heading").click(function() {
		$(".accordion-heading").removeClass("accordion-heading-focus");
		$(this).addClass("accordion-heading-focus");
	})

	$(".breaddisabled").click(function() {
		return false
	});

	$(document).on("click",".breadcrumb li a", function(event) {
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

			if(fileUploadLocation.length > 0) {
				if(editItems[pos].fileLocation) {
					data.fileLocation = editItems[pos].fileLocation
					for(var i = 0; i < fileUploadLocation.length; i++) {
						data.fileLocation.push(fileUploadLocation[i])
						console.log(data)
					}
				} else {
					data.fileLocation = fileUploadLocation;

				}

			}
			createMetaDataModels("#singleData", function(model) {
				var link = socket + "/dev/objects/" + $(".items li.accordion-heading-focus").find("a").attr("href") + "/update";
				data.properties = model
				updateData('POST', data, link, function(id) {
					$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
					fileUploadLocation = new Array();
				})
			})
		}
	})

	$(document).on("click",".addInput",function(event){
		event.preventDefault();
		$(this).next().append(addSpecialField($(this).attr("data-type"),$(this).attr("data-type")));
	})

	$('#step3EditBtn').click(function() {
		loadAllImages($("input[name='_id']").val());
	})

	$(document).on("click",".items #list2 li a", function(event) {
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
	$(document).on("click",".items ul li a", function(event) {
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

	$(document).on("click","#createItems", function(event) {
		id = Backbone.history.fragment
		if(id != "collections") {
			id = id.substr(2, id.length);
			$("#itemEditSelection").val(id)
		}
		emptyForm();
	});

	$(document).on("click","#createCollection,#createSerie,#createItems", function(event) {
		event.preventDefault;
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
	$(".upload").remove();
}



function addInputFieldToFrom(index,dataObject){
	var name = dataObject[index].name;
	var root = '<div id="' + dataObject[index].name + '"class="formInput">'
	root += '<h3>' + dataObject[index].name + '</h3>'
	root += '<a class="close" data-dismiss="alert" href="#">&times;</a><hr>'
	for(var i in dataObject[index].value) {

		root += '<div class="control-group"><label class="control-label">' +i + '</label>';
		if(checkSpecialField(i+name)){
			root += '<a class="close" data-dismiss="alert" href="#">&times;</a>';	
			root += "<div class='controls'><button class='btn addInput' data-type='"+i+name+"'>Add " + i +"</button>";
			root += '<ul data-name="'+i+'" id="ul'+counter+'">'+addSpecialField(name,i+name)+'</ul>';
		} else if(checkSingleField(i+name)) {
			root += '<div class="controls">';
			root += addSpecialField(name,i+name);
			root += '</div><a class="close specialClose" data-dismiss="alert" href="#">&times;</a></div>';
		} else {
			root += '<div class="controls"><input type="text" id="' + i + counter + '" name="' + i + '" class="input-xlarge" />';
			root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
		}
	}

	root +="</div>"
	counter++;

	$(".dataform").append(root);
	
	//$(".dataform .chzn-select").chosen()

	
}



function addEditFormFields(dataObject, name) {
	var root = '<div id="' + name + '"class="formInput">'
	root += '<h3>' + name + '</h3>'
	root += '<a class="close" data-dismiss="alert" href="#">&times;</a><hr>'

	for(var j in optionsArray) {
		for(var i in optionsArray[j].value) {
			if(optionsArray[j].name == name) {
				root += '<div class="control-group"><label class="control-label">' + i + '</label>';
				if(checkSpecialField(i+name)) {
					root += '<a class="close" data-dismiss="alert" href="#">&times;</a>';
					root += "<div class='controls'><button class='btn addInput' data-type='" + i+name + "'>Add " + i + "</button>";
					root += '<ul data-name="' + i + '" id="ul' + counter + '">' + addSpecialField(name,i+name) + '</ul>';
				} else if(checkSingleField(i+name)) {
					root += '<div class="controls">';
					root += addSpecialField(name,i+name);
					root += '</div><a class="close specialClose" data-dismiss="alert" href="#">&times;</a></div>';
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
	
	//$(".dataform .chzn-select").chosen().trigger("liszt:updated");
	
}



function loadAllImages(id) {
	$("#imageContainer").empty();
	loadData("object/media/" + id + "/list", function(data) {
		for(var file in data) {
			$("#imageContainer").append("<img src='object/media/" + data[file]._id + "/get'>")
		}
	});
}

var specialFields = ["topicsubject","internetMediaTypephysicalDescription","languageTermlanguage","dateOtheroriginInfo","abstractabstract"]
function checkSpecialField(name) {

	for(var i = 0; i < specialFields.length; i++) {
		if(name == specialFields[i]) {
			return true;
		}
	}
	return false;
}

var singleFields = ["accessConditionaccessCondition","typerelatedItem","typeidentifier","namesubject","typesubject","texttableOfContents","typetableOfContents","typenote","typephysicalDescription","digitalOriginphysicalDescription","typeOfResourcetypeOfResource", "genregenre","notenote", "typetitleInfo","typename","authorityname","rolename"]
function checkSingleField(name) {

	for(var i = 0; i < singleFields.length; i++) {
		if(name == singleFields[i]) {
			return true;
		}
	}
	return false;
}

function addSpecialField(name,prop) {
	counter++
	removebtn = '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>'
	switch(prop) {
		case "role":
			return "<li data-type='role'><div class='inputBox'><select class='input-small' name='role'  id='"+name+counter+"' ><option value='text'>text</option>" 
			+ "<option value='code'>code</option></select>"
			+ "<label>Authority</label><input id='"+name+counter+"a' name='authority' type='text' class='input-small'>" + removebtn + "</div></li> ";
			break;
		case "typeOfResourcetypeOfResource":
			return createSelect(resourceTypes, name);
			break;
		case "genregenre":
			return "<label>Authority</label><input  id='input"+counter+"a' name='authority' value='aat' type='text' class='input-small'><br />"
			+"<label>Genre</label>"+createSelect(genres,"genre")+"<br /><hr>";
			break
		case "place":
			return "<li><div class='inputBox'><hr><select id='input"+counter+"' class='input-small'><option value='text'>text</option>" 
			+ "<option value='code'>code</option></select>"
			+"<label>Authority</label><input id='input"+counter+"a' name='authority' type='text' class='input-small'><br>"
			+"<label>Place</label><input id='input"+counter+"b' name='place' type='text' class='input-small'>"+ removebtn + "</div></li> ";
			break;
		case "digitalOriginphysicalDescription":
			return createSelect(physicalDescriptionObjects, "digitalOrigin")
			break;
		case "internetMediaTypephysicalDescription":
		 	return "<li class='dummy'><div class='inputBox'><label>Type:</label>"+createSelect(mediaTypes,"internetMediaType") + removebtn + "</div></li> ";
			break;
		case "abstractabstract":
			return "<li><div class='inputBox'><label>Type:</label>"+createSelect(abstractType,"type")+"<br /><textarea  id='input"+counter+"' rows='5' cols='50'></textarea>" + removebtn + "</div></li>" ;
			break
		case "notenote":
			return "<textarea  id='input"+counter+"'  rows='5' cols='50'></textarea>";
			break
		case "topic":
			return "<li class='dummy'><div class='inputBox'><label>Topic:</label><input id='input"+counter+"' type='text' name='topic'>" + removebtn + "</div></li> ";
			break;
		case "identifier":
			return "<li class='dummy'><div class='inputBox'><label>type</label><input id='input"+counter+"a' name='type' type='text' class='input-small'>"
			+"<label>value</label><input id='input"+counter+"' name='value' type='text' class='input-small'>" + removebtn + "</div></li> ";
			break;
		case "dateOtheroriginInfo":
			return "<li><div class='inputBox'><label>point</label>"+createSelect(dateOther,"point")+"<br />"
			+"<label>dateOther</label><input id='input"+ counter +"a' name='dateOther' type='text' class='input-small'><br />"+ removebtn + "</div></li>";
			break;
		case "languageTermlanguage":
		return "<li><div class='inputBox'><hr><select id='input"+counter+"' class='input-small'><option value='text'>text</option>" 
			+ "<option value='code'>code</option></select>"
			+"<label>Authority</label><input id='input"+counter+"a' name='authority' type='text' value='iso639-2b' class='input-small'><br>"
			+"<label>language</label>"+createSelect(languages,"language")+ removebtn + "</div></li> ";
			break;
		case "name":
			return "<li><div class='inputBox'><hr>"
			+"<label>namePart</label><input id='"+name+counter+"d' name='namePart' type='text' class='input-small'><br>"
			+"<label>displayForm</label><input id='"+name+counter+"e' name='displayForm' type='text' class='input-small'><br>"
			+"<label>affiliation</label><input id='"+name+counter+"f' name='affiliation' type='text' class='input-small'><br>"+ removebtn + "</div></li>";
			break
		case "typetitleInfo":
			return createSelect(titleType,"type")
			break 
		case "typename":
			return createSelect(nameType,"type")
			break 
		case "authorityname":
			return createSelect(nameAuth,"authority")
			break 
		case "rolename":
			return createSelect(nameRole,"role")
			break 
		case "typephysicalDescription":
			return createSelect(physcialDescriptionType,'type')
			break;
		case "typenote":
			return createSelect(noteType,'type')
			break;
		case "typetableOfContents":
			return createSelect(abstractType,'type')
			break;
		case "texttableOfContents":
			return "<textarea  id='input"+counter+"' rows='5' cols='50'></textarea>"
			break;
		case "namesubject":
			return "<label>name</label><input id='"+name+counter+"' name='name' type='text' class='input-large'><br>"
			+"<label>type</label>"+ createSelect(nameType,"type")+"<br />"
			+"<label>authority</label>"+createSelect(nameAuth,"authority")
			+"<hr>"
			break;
		case "topicsubject":
			return "<li><div class='inputBox'><hr><label>topic</label><input id='"+name+counter+"' name='topic' type='text' class='input-large'><br>"
			+"<label>authority</label>"+createSelect(subjectAuth,"authority")
			+ removebtn + "</div></li>";
			break;
		case "typeidentifier":
			return createSelect(identifiertype,"type")
			break;
		case "typerelatedItem":
			return createSelect(relatedType,"type")
			break;
		case "accessConditionaccessCondition":
			return createSelect(accessConditions,"type")
			break;
		
	}
}

function createSelect(items, name) {
	var root = "<select class='chzn-select' name='" + name + "' id='select"+counter+"'>"
	for(var i = 0; i < items.length; i++) {
		root += "<option value="+items[i]+">" + items[i] + "</option>";
	}
	root += "</select>"
	return root;
}



function createMetaDataModels(form,callback) {
	var dataBlocks = $(".dataform > div",form).not(".upload");
	Model = Backbone.Model.extend();

	var dataModel = new Model();
	var parent = new Object();
	for(var k = 0; k < dataBlocks.length; k++) {
		var b = new Object();
		if(parent[$(dataBlocks[k]).attr("id")] == undefined) {
			parent[$(dataBlocks[k]).attr("id")] = new Array();
		}

		var fields = $("input,select,textarea", dataBlocks[k]).not("ul input, ul select");

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
		dataModel.set(parent);
	}
	callback(dataModel.toJSON());
}


function addProjectField(obj) {

	if($(obj).text() == "objectId") {
		var root = '<div class="control-group"><label class="control-label">' + $(obj).text() + '</label>';
		root += '<div class="controls"><input type="text" id="' + $(obj).text() + '" name="' + $(obj).text() + '" class="input-xlarge" />';
		root += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
		$(".dataform").prepend(root)

	} else if($(obj).text() == "upload") {

		$.get("/upload.htm", function(data) {
			var test = "<div class='formInput' id='" + $(obj).text() + "'><a class='close' data-dismiss='alert'>×</a>" + data + "</div>";
			$(".dataform").before(test)
		})
	}

}



