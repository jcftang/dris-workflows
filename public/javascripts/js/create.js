//Javascript for CREATE page
/*------------------------------------
 *           -- CREATE --
 *------------------------------------ */
function loadCreateData() {
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
		var option = $("#step5 input[name='media']:checked").val()
		createMediaItem(fileUploadLocation, option)
	})

	$("#createMedia").live("click", function(event) {
		$("#step5 h3").after($("#step1 form .breadcrumb"));
		$("#step5 .breadcrumb a").removeAttr("href")
		fileUploadLocation = new Array();
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
	var link = socket + driPath + "objects";

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
	var link = socket + driPath + "objects";
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

function createMediaItem(file, option) {
	if(file.length > 0) {
		var link = socket + driPath + "objects";
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
		if(option == "one") {
			data.fileLocation = file
		} else {
			data.fileLocation = [file[0]];
			file.splice(0, 1)
		}

		postData($('#itemCreation'), 'POST', data, link, function(id) {
			if(option == "multi") {
				createMediaItem(file, option)
			}
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
	loadData(driPath + "objects/" + $("#itemEditSelection").val() + "/list", function(data) {
		for(var i = 0; i < data.length; i++) {
			if(parseInt(data[i].properties.objectId) >= parseInt(objId)) {
				var link = socket + driPath + "objects/" + data[i]._id + "/update";
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
		var link = socket + driPath + "objects";
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
