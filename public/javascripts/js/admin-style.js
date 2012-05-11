/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */
var workspace = backbone();
var goDeeper = true;
var parentType = "";

$(document).ready(function() {
	workspace.navigate("#collections", {
		trigger : true
	});
	$('#checkAll').live('click', function() {
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
	$('.removeItem').live("click", function() {
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
	$('.approveItem').live("click", function() {
		$this = $(this)
		$this.attr("disabled", "disabled");
		$this.addClass('disabled')
		$this.attr("value", "Approving");
		id = $(this).attr("data-id");
		approveItem(id, function(err, data) {
			if(err) {
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.attr("value", "Approve");
			} else {
				console.log(data);
				$this.attr("value", "Approved");
			}
		});
	});
	$("tbody a").live("click", function() {
		goDeeper = true;
		parentType = $(this).attr("data-type");
	});
})
function loadAdminData() {
	$('#loadingDiv').show()
	loadData("/dev/objects", function(items) {
		$("tbody").empty();
		for(i in items) {
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "' href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
		$('#loadingDiv').hide()
		if(items.length == 0) {
			$("tbody").append("<tr><td></td><td>No items available<td></tr>")
			$('#loadingDiv').hide()
		}
	});
}

function loadChildren(id) {
	$('#loadingDiv').show()
	id = id.substring(2, id.length)

	$("tbody").empty();
	loadData("/dev/objects/" + id + "/list", function(items) {
		$("tbody").empty();
		$('#loadingDiv').hide()
		if(items.length == 0) {
			$("tbody").append("<tr><td class='center' colspan='5'>No Children here</td></tr>")
		} else {
			for(i in items) {
				if(items[i].status == "approved") {
					$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem disabled' value='Approved' disabled data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
				} else {
					$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#id" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
				}
			}
		}
	});

}

function approveAllSelected() {
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if(confirmDialog == true) {
		$('#series-table tbody input:checked').each(function() {
			console.log($(this))
			approveItem($(this).attr("data-id"), function(err, id) {

				if(err) {
					console.log(err);
				} else {
					console.log(id);
					$(this).attr("value", "Approved");
				}
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
	console.log(socket + "/dev/objects/" + id + "/delete")
	$.ajax({
		type : "get",
		url : socket + "/dev/objects/" + id + "/delete",
		dataType : "jsonp",
		cache : false,
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
		url : socket + "/dev/objects/" + id + "/approve",
		type : "GET",
		success : function(data) {
			callback(null, data);
		},
		error : function(d, r) {
			callback(r, null);
			console.log(d);
			console.log(r);
		}
	});
};

function loadData(link, callback) {
	$.ajax({
		url : socket + link,
		type : "GET",
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
			if(goDeeper) {
				goDeeper = false;
			} else {
				$(".breadcrumb li:last").remove();
			}
		},
		defaultRoute : function() {
			console.log(Backbone.history)
			if(goDeeper) {
				$(".breadcrumb").append("<li>" + parentType + ": " + Backbone.history.fragment + "<span class='divider'>/</span></li>")
				goDeeper = false;
			} else {
				$(".breadcrumb li:last").remove();
			}
			loadChildren(Backbone.history.fragment);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}
