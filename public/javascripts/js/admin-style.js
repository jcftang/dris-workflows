/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */
var workspace = backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""
var positionObj = ["#collections"];

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
				approveAllSelected();
				if(!('#checkAll:checkbox[checked]').length) {
					('#checkAll').removeAttr("checked");
				}
				break;
			case "remove":
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
				$this.attr("value", "Approved");
			}
		});
	});
	$("tbody a").live("click", function() {
		goDeeper = true;
		parentType = $(this).attr("data-type");
		currentParentName = $(this).text()
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
})
function createPagination(meta) {
	//console.log(Backbone.history.fragment)
	var pos = Backbone.history.fragment.indexOf('/')+1
	var id = Backbone.history.fragment.substring( pos, (pos +24))
	//console.log(id)
	if(meta.numPages <2){
		return
	}
	if(meta.page == 0){
		meta.page = 1
	}
	var currentPage = parseInt(meta.page)
	console.log(currentPage)
	// Create pagination
	var pagination = $(".pagination ul")
	pagination.empty();

	// Add general back button
	var a = $(document.createElement('a'))
	a.text("<<")
	a.attr('href', '#id/' + id + "/" + (currentPage-1))
	var goBack = $(document.createElement('li')).append(a);
	if(meta.page < 2) {
		goBack.addClass('disabled')
		a.click(function(e) {
			e.preventDefault();
		})
	}
	pagination.append(goBack)

	// Add pages
	for(var i = 1; i < meta.numPages; i++) {
		var pagecntrl = $(document.createElement('li'))
		var a = $(document.createElement('a'))
		if(i == meta.page) {
			pagecntrl.addClass('active')
			a.click(function(e) {
				e.preventDefault();
			})
		}
		a.attr('href', '#id/' + id + "/" + i)
		a.text(i)
		pagecntrl.append(a)
		pagination.append(pagecntrl)
	};

	// Add general forward button
	var a = $(document.createElement('a'))
	a.text(">>")
	a.attr('href', '#id/' + id + "/" + (currentPage+1))
	var goForward = $(document.createElement('li')).append(a);
	if(meta.page > (meta.numPages - 2)) {
		goForward.addClass('disabled')
		a.click(function(e) {
			goDeeper = true;
			e.preventDefault();
		})
	}
	pagination.append(goForward)

}

function loadAdminData(page, amount) {
	$('#loadingDiv').show()
	var link = ""
	if(page && amount) {
		link = "/dev/objects?page=" + page + "&amount=" + amount
	} else {
		link = "/dev/objects"
	}
	loadData(link, function(meta, items) {
		
		createPagination(meta)
		$("tbody").empty();
		for(i in items) {
			var fedoraId = (items[i].fedoraId) ? items[i].fedoraId : "-";
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "' href='#id/" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
		$('#loadingDiv').hide()
		if(items.length == 0) {
			$("tbody").append("<tr><td colspan='5'>No items available</td></tr>")
			$('#loadingDiv').hide()
		}
	});
}

function loadChildren(id, page, amount) {
	$('#loadingDiv').show()

	$("tbody").empty();
	var link = ""
	if(page && amount) {
		link = "/dev/objects/" + id + "/list?page=" + page + "&amount=" + amount
	} else {
		link = "/dev/objects/" + id + "/list"
	}
	loadData(link, function(meta, items) {
		$("tbody").empty();
		$('#loadingDiv').hide()
		if(items.length == 0) {
			$("tbody").append("<tr><td colspan='5'>No Children here</td></tr>")
		} else {
			createPagination(meta)
			for(i in items) {
				var fedoraId = (items[i].fedoraId) ? items[i].fedoraId : "-";
				if(items[i].status == "approved") {
					$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem disabled' value='Approved' disabled data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
				} else {
					$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
				}
			}
		}
	});

}

function approveAllSelected() {
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if(confirmDialog == true) {
		$('#series-table tbody input:checked').each(function() {
			approveItem($(this).attr("data-id"), function(err, id) {

				if(err) {
					console.log(err);
				} else {
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
			removeItem($(this).attr("data-id"), function(id) {
				$("#" + id).remove();
			})
		});
	}
};

function removeItem(id, callback) {
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
		cache : false,
		type : "GET",
		dataType : 'jsonp',
		success : function(data, status, r) {
			callback(data.meta, data.objects);
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
			"id/:id/:page" : "pageRoute",
			"id/:id" : "defaultRoute"
		},
		collection : function() {
			loadAdminData();
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:last").remove();
				}
			}
			goDeeper = false;
		},
		defaultRoute : function(id, page) {
			if(goDeeper) {
				$("form .breadcrumb a:last").parent().removeClass("active");
				$(".row .breadcrumb").append("<li class='active'><a href='" + Backbone.history.fragment + "'>" + parentType + ": " + currentParentName + "</a><span class='divider'>/</span></li>");
				goDeeper = false;
			} else {
				$(".row .breadcrumb li:last").remove();
				$("form .breadcrumb a:last").parent().addClass("active");
			}
			loadChildren(id, 0, 20);
		},
		pageRoute : function(id, page) {
			
			loadChildren(id, page, 20);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}
