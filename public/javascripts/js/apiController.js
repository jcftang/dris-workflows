/*
* @author Matthias Van Wambeke
* ONLY the edit and create page use this file. For Admin page js please refer to admin-style.js
*/
//initiating variables
var workspace = backbone();
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
			loadStatistics();
			break;
		case "/edit":
			workspace.navigate("", {
				trigger : true
			});
			loadEditData();
			break;
		case "/all":
			setUpQueryPage();
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
	$(document).on("click", ".close", function() {
		if(!$(this).hasClass("mdl"))
			$(this).parent().remove();
	});
});
/*------------------------------------
 *            -- Stats --
 *------------------------------------ */

//loads statistics in one by one, can otherwise not know what data is being loaded in.
function loadStatistics() {
	LoadSimpleStats(0);
	loadItemData("lastCreated")
	loadItemData("lastEdited")
	loadItemDataByType("lastEdited","item","editItem")
	loadItemDataByType("lastEdited","series","editSeries")
	loadItemDataByType("lastEdited","collection","editCollection")
}

function loadItemData(name){
	createLoadingRow("#"+ name + " tbody");
	var link = driPath + "stats/" + name.toLowerCase()
	loadData(link, function(data) {
		$('.loadingDiv').remove()
		for(var i in data){
			
			titleCheck(data[i],function(title){
				var date = ""

				if(name == "lastCreated"){
					date = jQuery.timeago(data[i].dateCreated)
				}else{
					date = jQuery.timeago(data[i].dateModified)
				}
				var label = "IN-" + data[i].label.substring(0, amountLblChars);
				$("#"+name+" tbody").append("<tr><td>" + label + "</td><td>" +date+ "</td><td>"+data[i].type+"</td></tr>")
			})
			
		}
		if(data.length == 0){
			$("#"+name+" tbody").append("<tr><td colspan='3'>No objects yet.</td></tr>")
		}
		

	}, function(err) {
		$('.loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('.loadingDiv').append(td)
	}); 

}
function loadItemDataByType(name,option,field){
	console.log(name)
	createLoadingRow("#"+ field + " tbody");
	var link = driPath + "stats/" + name.toLowerCase()+"/"+option
	loadData(link, function(data) {
		$('.loadingDiv').remove()
		for(var i in data){
			console.log(data)
			titleCheck(data[i],function(title){
				var date = ""
				if(name == "lastCreated"){
					date = jQuery.timeago(data[i].dateCreated)
				}else{
					date = jQuery.timeago(data[i].dateModified)
				}
				var label = "IN-" + data[i].label.substring(0, amountLblChars);
				$("#"+field+" tbody").append("<tr><td>" + label + "</td><td>" +date+ "</td><td>"+data[i].type+"</td></tr>")
			})
			
		}
		if(data.length == 0){
			$("#"+field+" tbody").append("<tr><td colspan='3'>No objects yet.</td></tr>")
		}
		

	}, function(err) {
		$('.loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('.loadingDiv').append(td)
	}); 

}

function LoadSimpleStats(numb){
		if(numb == 0) {
		$("#stats tbody").empty()

	}
	
	//stats to be loaded in, must equal name in the link
	var stats = ["all", "approved", "open"]
	if(numb <= stats.length - 1) {
		createLoadingRow("#stats tbody");
		var item = stats[numb]
		var link = driPath + "stats/" + stats[numb]
		//there is no all link
		if(item == "all") {
			link = driPath + "stats/"
		}


		loadData(link, function(data) {
			$('.loadingDiv').remove()
			$("#stats tbody").append("<tr><td>" + item + " objects</td><td>" + data + "</td>")
			numb++;
			
			LoadSimpleStats(numb)
		}, function(err) {
			$('.loadingDiv').empty()
			var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
			$('.loadingDiv').append(td)
		});
	}
}




/*------------------------------------
 *           -- Data Load --
 *------------------------------------ */

function loadTopLevelData(page, amount) {
	$("tbody").empty();
	createLoadingRow("#step1 tbody");
	var link = driPath + "objects?page=" + (page - 1) + "&amount=" + amount

	loadData(link, function(items, meta) {
		$("tbody").empty();
		createPagination(meta)
		console.log(items)
		for(i in items) {
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var checkbox = "<td><input name='items' type='checkbox' data-id='" + items[i]._id + "'></td>";
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>"
			if(window.location.pathname == "/create" || window.location.pathname == "/browse") {
				checkbox = ""
				action = ""
			}
			var details = "<span class='details'><span class='divider'> |</span><a href='/overview/"+items[i]._id +"'>details</a></span>"
			
			titleCheck(items[i], function(title) {
				$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + checkbox + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + title + "</a>"+details+"<i data-id='" + items[i]._id + "'class='icon icon-eye-open' rel='tooltip' title='Quick view'></i></td><td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td>" + action + "</tr>")
			})


			
		}
		if(items.length == 0) {
			$("#step1 tbody").append("<tr><td colspan='5'>No objects available</td></tr>")
			$('.loadingDiv').hide()
		}

	}, function(err) {
		$('.loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('.loadingDiv').append(td)
	});

}

function loadpIdData(page, amount) {
	var link = driPath + "objects?page=" + (page - 1) + "&amount=" + amount

	loadData(link, function(items, meta) {
		createPagination(meta)
		$(".modal tbody").empty();

		for(i in items) {
			var rbt = "<td><input name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			titleCheck(items[i], function(title) {
					$(".modal tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + title + "</a></td><td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td></tr>")
				})
			
		}

	});

}

function loadPidChildren(id, page, amount) {
	var link = driPath + "objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	loadData(link, function(items, meta) {
		createPagination(meta)
		$(".modal tbody").empty();
		for(i in items) {
			var rbt = "<td><input  name='items' type='radio' data-id='" + items[i]._id + "'></td>";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);
			var action = "<td class='span1'><a class='btn btn-mini editRow'  data-id='" + items[i]._id + "'>Edit</a></td>";
			titleCheck(items[i], function(title){
				$("tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + title + "</a></td><td><a data-type='" + items[i].type + "'  href='#pd/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td></tr>")
			})
		}
		if(items.length == 0) {
			$(".modal tbody").append("<tr><td colspan='5'>No Children here</td></tr>")
		}
	});

}

function loadChildren(id, page, amount) {
	$("tbody").empty();
	var link = driPath + "objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	createLoadingRow("#step1 tbody");
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
				if(window.location.pathname == "/create" || window.location.pathname == "/all" || window.location.pathname == "/browse") {
					rbt = ""
					action = ""
				}
				titleCheck(items[i], function(title) {
					$("#step1 tbody").append("<tr id='" + items[i]._id + "'>" + rbt + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + title + "</a><i data-id='" + items[i]._id + "'class='icon icon-eye-open' rel='tooltip' title='Quick view'></i></td><td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td><td>" + items[i].type + "</td>" + action + "</tr>")
				})
			}

		}

		$('.loadingDiv').hide()

	}, function(err) {
		$('.loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('.loadingDiv').append(td)
	}); 


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
