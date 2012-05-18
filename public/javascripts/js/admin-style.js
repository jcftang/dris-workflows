/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */
var itemsPerPage = 20;
var amountPages = 10;
var childrenPerPage = 20;
var workspace = backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""

$(document).ready(function() {
	workspace.navigate("", {
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
	$('.btnCompareFedora').live("click", function(e) {
		console.log("btn")
		var btn = $(e.target)
		var id = btn.attr('data-id')
		window.location = "/compare#compare/"+id
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


function loadAdminData(page, amount) {
	$('#loadingDiv').show()
	var link = "/dev/objects?page=" + (page - 1) + "&amount=" + amount + "&callback=?"

	loadData(link, function(meta, items) {
		createPagination(meta)
		$("tbody").empty();
		for(i in items) {
					var fedoraId = (items[i].fedoraId) ? "<div class='input-append'><input type='text' class='span2' disabled value='"+items[i].fedoraId + "' /> <button class='btn btnCompareFedora' data-id='"+items[i]._id +"' type='button' value='compare'>Compare</button></div>" : "-";
			var disabled = (items[i].type == "item") ? "" : "disabled";
			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + 
			"<td><a data-type='" + items[i].type + "' href='#" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + 
			"<td>" + fedoraId + "</td>" + 
			"<td>" + items[i].type + "</td>" + 
			"<td><input type='button' class='btn btn-success btn-mini approveItem' "+disabled+" value='Approve' data-id='" + items[i]._id + "'/></td>" + 
			"<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
		if(items.length == 0) {
			$("tbody").append("<tr><td colspan='6'>No items available</td></tr>")

		}
		$('#loadingDiv').hide()
	}, function(err) {
		$('#loadingDiv').empty()
		var td = $(document.createElement('td'))
		td.attr('colspan', '6')
		td.addClass('alert-error')
		td.text(err)
		$('#loadingDiv').append(td)
	});
}

function createLoadingRow(){	
	var tr = $(document.createElement('tr')).attr('id', 'loadingDiv')
	var loading = $(document.createElement('i')).addClass('icon-refresh')
	
	var td = $(document.createElement('td')).attr('colspan', '4').append(loading).text(" Loading...");
	tr.append(td)
	
	$('tbody').append(tr)
}

function loadChildren(id, page, amount) {
	$("tbody").empty();
	createLoadingRow();

	var link = "/dev/objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	loadData(link, function(meta, items) {
		$("tbody").empty();
		$('#loadingDiv').hide()
		if(items.length == 0) {
			createPagination(meta)
			$("tbody").append("<tr><td colspan='6'>No Children here</td></tr>")
		} else {
			if(meta.numPages > 20) {
				childrenPerPage = meta.numPages;
				loadChildren(id, page, childrenPerPage);
			} else {
				createPagination(meta)
				for(i in items) {
					var fedoraId = (items[i].fedoraId) ? "<div class='input-append'><input type='text' class='span2' disabled value='"+items[i].fedoraId + "' /> <button class='btn btnCompareFedora' data-id='"+items[i]._id +"' type='button' value='compare'>Compare</button></div>" : "-";
					var disabled = (items[i].type == "item") ? "" : "disabled";
					if(items[i].status == "approved") {
						$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem disabled' value='Approved' disabled data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
					} else {
						$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + items[i].properties.titleInfo[0].title + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve'  "+disabled+"  data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
					}
				}
			}
		}
	}, function(err) {
		$('#loadingDiv').empty()
		var td = $(document.createElement('td'))
		td.attr('colspan', '6')
		td.addClass('alert-error')
		td.text(err)
		$('#loadingDiv').append(td)
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
			workspace.navigate(Backbone.history.fragment, {
					trigger : true
				});
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

function loadData(link, callback, error) {
	$.ajax({
		url : socket + link,
		cache : false,
		type : "GET",
		dataType : 'jsonp',
		timeout : 2000,
		success : function(data, status, r) {
			callback(data.meta, data.objects);
		},
		error : function(x, h, r) {
			if(r == "timeout") {
				error("Connection to the API could not be established")
			} else {
				error(x)
			}
			console.log(x);
			console.log(h);
			console.log(r);
		}
	});

}

function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"" : "collection",
			"/:page" : "collection2",
			":id/:page" : "pageRoute",
			":id" : "defaultRoute"
		},
		collection : function() {
			loadAdminData(1, itemsPerPage);
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:last").remove();
				}
			}
			goDeeper = false;
		},
		collection2 : function(page) {
			console.log("page" + page)
			loadAdminData(page, itemsPerPage);
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
			loadChildren(id, 1, childrenPerPage);
		},
		pageRoute : function(id, page) {
			
			loadChildren(id, page, childrenPerPage);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}
