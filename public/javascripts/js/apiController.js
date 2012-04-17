var port = 4000;
var socket = 'http://localhost:' + port;
var w = backbone();
$(document).ready(function() {

	jQuery.support.cors = true;
	switch(window.location.pathname) {
		case "/edit":
			loadEditData();
			w.navigate("#step1", {
				trigger : true
			});
			break;
		case "/all":
			loadMediaData();
			break;
		case "/create":
			loadCreateData();
			w.navigate("#step1", {
				trigger : true
			});
			break;
	}

});

function loadCreateData() {

	$("#createSerie").live("click", function(event) {
		loadData("/dev/objects", function(items) {
			root = "<optgroup label='collections'>";

			//creates several options depending on the type of the data. Example <option>title (author)</option> for series.
			for(i in items) {
				if(items[i].type ="collection")
				root += "<option value='";
				root += items[i]._id + "'>" + items[i].properties.title;
				root += "</option>";
			}
			root += "</optgroup>";

			$(".seriesCollection").empty();
			$(".seriesCollection").append(root);
			$(".seriesCollection").chosen();
		})
		emptyForm();
	});

	$("#createCollectionBtn").click(function() {
		var link = socket + "/dev/objects";

		var data = {
			"status" : "Open",
			"type" : "collection",
			"properties":{}
		};
		items = $('#collectionCreation').serializeArray();
		postData($('#collectionCreation'), 'POST', prepareDataForPost(data,items), link,function(id){
		});
	})

	$("#createSerieBtn").click(function() {
		var link = socket + "/dev/objects";
		var data = {
			"status" : "Open",
			"type" : "series",
			"properties":{},
			parentId : $("#serieCreation select").val()
		};
		var items = $('#serieCreation').serializeArray();
		postData($('#serieCreation'), 'POST', prepareDataForPost(data,items), link,function(id){
		});
	})
	
	$("#createItemBtn").click(function(event) {
		event.preventDefault();
		var amount =  $("#amount").val();
		createItems(amount);
	})
}


function createItems(amount) {
	amount = parseInt(amount);
	if(amount > 1) {
		var link = socket + "/dev/objects";
		var data = {
			"status" : "Open",
			"type" : "item",
			"properties" : {},
			parentId : $("#itemCreation select").val()
		};
		var items = $('#itemCreation').serializeArray();

		items.splice(0,1);

		postData($('#itemCreation'), 'POST', prepareDataForPost(data, items), link, function(id) {
			amount = parseInt(amount)- 1;
			createItems(amount);
		});
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
	loadAllItems();
	$("#step2Btn").click(function() {
		item = $("#step1 option:selected").parent().attr("label");
		loadData("/dev/objects/" + $("#step1 select").val(), function(data) {
			var link = "dev/" + item + "";
			showItems([data], link, false)
			loadData("/dev/objects/" + $("#step1 select").val() + "/list", function(data) {
				var link = "dev/" + item + "/" + $("#step1 select").val() + "/series";
				showItems(data, link, true)
				emptyForm();
			});
		});
	})
}

function loadAllItems() {

	loadAllItemsByType("/dev/objects", function(root) {
		list = root;
		$("#itemEditSelection").append(list);
		$("#itemEditSelection").chosen();

	})
}


function loadAllItemsByType(link, callback) {

	loadData(link, function(items) {
		var root = "<optgroup label='collection'>";

		//creates several options depending on the type of the data. Example <option>title (author)</option> for series.
		for(i in items) {
			root += "<option value='";
			root += items[i]._id + "'>" + items[i].properties.title;
			root += "</option>";
			if(i == items.length - 1) {
				root += "</optgroup>";
				root += "<optgroup label='series'>";
				for(i in items) {
					loadData(link + '/' + items[i]._id + '/list', function(items) {
						for(j in items) {
							root += "<option value='";
							root += items[j]._id + "'>" + items[j].properties.title;
							root += "</option>";
							if(j == items.length - 1) {
								root += "</optgroup>";
								root += "<optgroup label='items'>";
								for(i in items) {
									loadData(link + '/' + items[i]._id + '/list', function(items) {
										for(k in items) {
											root += "<option value='";
											root += items[k]._id + "'>" + items[k].properties.title;
											root += "</option>";

											if(k == items.length - 1) {
												callback(root)
											}
										}
										if(items.length == 0) {
											callback(root);
										}
									});
								}
							}
						}
						if(items.length == 0) {
							callback(root);
						}

					});
				}
			}
		}

	});
}





/*Function: loadData

 Gets any data from the server and gives it back

 Parameters:

 link - url where the data should come frome
 callback - the function to return it to

 Returns:

 The requested data
 */


function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"edit" : "step2",
			"step1" : "step1", // #help
			"step2" : "step2", // #search/kiwis
			"step3" : "step3",
			"step4" : "step4"

		},

		step1 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step1,#step1Info").show();
		},
		step2 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step2,#step2Info").show();

		},
		step3 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step3,#step3Info").show();

		},
		step4 : function() {

			$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
			$("#step4,#step4Info").show();

		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}

function loadData(link, callback) {
	$.ajax({
		url : socket + link,
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
	console.log("link" + link);
	form.submit(function() {
		$.ajax({
			type : type,
			data : data,
			url : link,
			success : function(id) {
				w.navigate("#step1", {
					trigger : true
				});
				$(".successbox").show('fast');
				if(callback != undefined) {
					callback(id);

				}
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



function updateData(form, type, data, link, callback) {
	form.submit(function() {
		$.ajax({
			type : type,
			data : data,
			url : link,
			success : function(id) {
				console.log("id");
					callback(id);
					$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
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