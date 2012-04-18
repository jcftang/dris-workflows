/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */
var port = 4000;
var socket = 'http://localhost:' + port;
var w = backbone();
var goDeeper = true;
var parentType = "";

$(document).ready(function() {
w.navigate("#collections", {
		trigger : true
	});
	$('#checkAll').live('click',function() {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$('#bulk-execute').click(function() {
		var action = $(this).prev().val();
		switch(action) {
			case "approve":
				console.log("Approve");
				approveAllSelected();
				if(!('#checkAll:checkbox[checked]').length) {
					('#checkAll').removeAttr("checked");
				}
				break;
			case "remove":
				console.log("Remove All");
				removeAllSelected();
				$(this).prev().val("-1");
				if(!('#checkAll:checkbox[checked]').length) {
					('#checkAll').removeAttr("checked");
				}
				break;
			default:
				console.log("Select an action");
		}
	});
	$('.removeItem').live("click",function() {
		$this = $(this)
		id = $(this).attr("data-id");

		var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
		if(confirmDialog == true) {
			removeItem(id, function(id) {
				console.log(id);
				$("#" + id).remove();
			})
		}
	});
	$('.approveItem').live("click",function() {
		$this = $(this)
		id = $(this).attr("data-id");
		console.log("Approve: " + id);
		approveItem(id, function(data) {
			console.log(data);
		});
	});
	$("tbody a").live("click",function(){
		goDeeper = true;
		parentType = $(this).attr("data-type");
	})
});



function loadAdminData() {
	console.log("load");
	$("tbody").empty();

	loadData("/dev/objects", function(items) {
		for(i in items) {
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td><td><a data-type='"+items[i].type +"' href='#id" + items[i]._id + "'>" + items[i].properties.title + "</a></td><td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td><td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
		if(items.length == 0) {
			$("tbody").append("<tr><td></td><td>No items available<td></tr>")
		}
	});
}




function loadChildren(id) {
	console.log("load2");
	console.log(id)
	id = id.substring(2,id.length)
	console.log(id)
	$("tbody").empty();
	loadData("/dev/objects/" + id + "/list", function(items) {
		console.log(items)
		for(i in items) {
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td><td><a data-type='"+items[i].type +"'  href='#id" + items[i]._id + "'>" + items[i].properties.title + "</a></td><td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td><td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
		if(items.length == 0){
			$("tbody").append("<tr><td></td><td>No Children here<td><td></td></tr>")
		}
	}); 

}

	
function approveAllSelected() {
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if(confirmDialog == true) {
		$('#series-table tbody input:checked').each(function() {
			console.log($(this).attr("data-id"));
			approveItem($(this).attr("data-id"), function(id) {
				$("#" + id).remove();
			})
		});
	}

};

function removeAllSelected() {
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if(confirmDialog == true) {
		$('#series-table tbody input:checked').each(function() {
			console.log($(this).attr("data-id"));
			removeItem($(this).attr("data-id"), function(id) {
				$("#" + id).remove();
			})
		});
	}
};

function removeItem(id, callback) {
	console.log("/dev/objects/" + id + "/delete")
	$.ajax({
		type:"get",
		url : socket + "/dev/objects/" + id + "/delete",
		success : function(data) {
			callback(id);
		},
		error : function(d, r) {
			console.log(d);
			console.log(r);
		}
	});
};

function approveItem(id, callback) {
	$.ajax({
		url : "/fedora/" + id + "/approve",
		success : function(data) {
			callback(data);
		},
		error : function(d, r) {
			console.log(d);
			console.log(r);
		}
	});
};


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

function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"collections" : "collection",
			"id:id" : "defaultRoute"
		},

		collection : function() {
 			loadAdminData();
 			if(goDeeper){
			 goDeeper = false;
			}
			else{
				$(".breadcrumb li:last").remove();
			}
		},
		defaultRoute : function() {
			console.log(Backbone.history)
			if(goDeeper){
			$(".breadcrumb").append("<li>"+parentType+": "+Backbone.history.fragment+"<span class='divider'>/</span></li>")
			 goDeeper = false;
			}
			else{
				$(".breadcrumb li:last").remove();
			}
			loadChildren(Backbone.history.fragment);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}