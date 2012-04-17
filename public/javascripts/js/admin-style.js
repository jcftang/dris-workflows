/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */
var port = 4000;
var socket = 'http://localhost:' + port;
var w = backbone();

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
	$("tbody a").live("click",function(event){
		event.preventDefault();
		loadChildren($(this).attr("href"));
	});
});


function loadAdminData() {
	$("tbody").empty();

	loadData("/dev/objects", function(items) {
		for(i in items) {
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td><td><a href='" + items[i]._id + "'>" + items[i].properties.title + "</a></td><td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td><td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
	});
}



function loadChildren(id) {

	$("tbody").empty();
	w.navigate("#"+id, {
		trigger : true
	});
	loadData("/dev/objects/" + id + "/list", function(items) {
		for(i in items) {
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td><td><a href='" + items[i]._id + "'>" + items[i].properties.title + "</a></td><td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td><td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
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
			"*path" : "defaultRoute"
		},

		collection : function() {
 			loadAdminData();
		},
		defaultRoute : function() {
			alert( w.routes[Backbone.history.fragment] );
			loadChildren();
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