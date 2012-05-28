/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */

var workspace = backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""

$(document).ready(function() {
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
		id = $this.attr("data-id");
		approveItem(id, function(err, data) {
			if(err) {
				console.log(err)
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.attr("value", "Approve");
			} else {
				$this.attr("value", "Unapprove");
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.removeClass('approveItem')
				$this.addClass('unapproveItem')
				$this.removeClass('btn-success')
				$this.addClass('btn-warning')
				var fedoraContainer = $this.parent().prev().prev()
				fedoraContainer.text("")
				fedoraContainer.append($(createCompareButton(id, data.fedoraId)))
			}
		});
	});
	$('.unapproveItem').live("click", function() {
		$this = $(this)
		$this.attr("disabled", "disabled");
		$this.addClass('disabled')
		$this.attr("value", "Unapproving");
		id = $(this).attr("data-id");
		unapproveItem(id, function(err, data) {
			if(err) {
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.attr("value", "Unapprove");
			} else {
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.removeClass('btn-warning')
				$this.addClass('btn-success')
				$this.attr("value", "Approve");
				var fedoraContainer = $this.parent().prev().prev()
				fedoraContainer.text("-")
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
function createCompareButton(id, pid) {
	if(pid) {
		return "<div class='input-append'><input type='text' class='span2' disabled value='" + pid + "' /> <a class='btn btnCompareFedora' href='compare/" + id + "' type='button' value='compare'>Compare</button></div>"
	} else {
		return "-"
	}

}
function loadAdminData(page, amount) {
	createLoadingRow("tbody")
	var link = driPath + "objects?page=" + (page - 1) + "&amount=" + amount + "&callback=?"

	loadData(link, function(items, meta) {
		createPagination(meta)
		$("tbody").empty();
		for(i in items) {
			var fedoraId = createCompareButton(items[i]._id, items[i].fedoraId)
			var disabled = (items[i].type == "item") ? "" : "disabled";
			var label = "IN-" + items[i].label.substring(0, amountLblChars);

			titleCheck(items[i], function(title) {
				var details = "<span class='details'><span class='divider'> |</span><a href='/overview/"+items[i]._id +"'>details</a></span>"
				if(items[i].status == "approved") {
					$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + title + "</a>"+details+"<i data-id='" + items[i]._id + "'class='icon icon-eye-open' rel='tooltip' title='Quick view'></i></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + label + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-warning btn-mini unapproveItem' value='Unapprove' data-fedora='" + items[i].fedoraId + "' data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
				} else {
					$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + title + "</a>"+details+"<i data-id='" + items[i]._id + "'class='icon icon-eye-open' rel='tooltip' title='Quick view'></i></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + label + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-fedora='" + items[i].fedoraId + "' " + disabled + " data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
				}

			})

		}
		if(items.length == 0) {
			$("tbody").append("<tr><td colspan='7'>No items available</td></tr>")
		}
		$('.loadingDiv').remove()
	}, function(err) {
		$('.loadingDiv').empty()
		var td = $(document.createElement('td')).attr('colspan', '6').addClass('alert-error').text(err)
		$('.loadingDiv').append(td)
	});
}

function loadChildren(id, page, amount) {
	$("tbody").empty();
	createLoadingRow("tbody");

	var link = driPath + "objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	loadData(link, function(items, meta) {
		$("tbody").empty();
		$('.loadingDiv').remove()
		if(items.length == 0) {
			createPagination(meta)
			$("tbody").append("<tr><td colspan='7'>No Children here</td></tr>")

		} else {
			if(meta.numPages > 20) {
				childrenPerPage = meta.numPages;
				loadChildren(id, page, childrenPerPage);
			} else {
				createPagination(meta)
				for(i in items) {

					var fedoraId = createCompareButton(items[i]._id, items[i].fedoraId)
					var disabled = (items[i].type == "item") ? "" : "disabled";
					var label = "IN-" + items[i].label.substring(0, amountLblChars);
					titleCheck(items[i], function(title) {
						var details = "<span class='details'><span class='divider'> |</span><a href='/overview/"+items[i]._id +"'>details</a></span>"
						if(items[i].status == "approved") {
							$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + title + "</a><i data-id='" + items[i]._id + "'class='icon icon-eye-open' rel='tooltip' title='Quick view'></i></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + label + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-warning btn-mini unapproveItem' value='Unapprove' data-fedora='" + items[i].fedoraId + "' data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
						} else {
							$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + title + "</a>"+details+"<i data-id='" + items[i]._id + "'class='icon icon-eye-open' rel='tooltip' title='Quick view'></i></td>" + "<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + label + "</a></td>" + "<td>" + fedoraId + "</td>" + "<td>" + items[i].type + "</td>" + "<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' data-fedora='" + items[i].fedoraId + "' " + disabled + " data-id='" + items[i]._id + "'/></td>" + "<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
						}
					})
				}
			}
		}

	}, function(err) {
		$('.loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('.loadingDiv').append(td)
	});
}

function loadCompareData(id) {
	var link = driPath + "objects/" + id + "/compare"
	loadData(link, function(data) {
		console.log(data)
		$('#mongoData').text(JSON.stringify(data.mongo, undefined, 4))
		$('#fedoraData').text(data.fedora)
	}, function(err) {
		console.log(err)
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
		goDeeper = false;
	}
};

function removeItem(id, callback) {
	$.ajax({
		type : "get",
		url : socket + driPath + "objects/" + id + "/delete",
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
	var link = driPath + "objects/" + id + "/approve"
	loadData(link, function(data) {
		callback(null, data)
	}, function(err) {
		console.log(err, null)
	});
};
function unapproveItem(pid, callback) {
	console.log(pid)
	var link = driPath + "objects/" + pid + "/unapprove"
	loadData(link, function(data) {
		callback(null, data)
	}, function(err) {
		console.log(err, null)
	});
};

function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"" : "collection",
			"/:page" : "collectionPage",
			":id/:page" : "pageRoute",
			":id" : "defaultRoute"

		},
		collection : function() {
			if(window.location.pathname.substr(0, 8) == "/compare") {
				var id = window.location.pathname.substr(9)
				loadCompareData(id)
			} else {
				loadAdminData(1, itemsPerPage);
				if(!goDeeper) {
					if($(".row .breadcrumb li").size() > 1) {
						$(".row .breadcrumb li:last").remove();
					}
				}
				goDeeper = false;
			}

		},
		collectionPage : function(page) {
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
			loadChildren(id, 1, itemsPerPage);
		},
		pageRoute : function(id, page) {
			loadChildren(id, page, itemsPerPage);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}
