$(document).ready(function(){

	$(document).on("click", ".icon-eye-open,.icon-eye-close", function() {
		var item = $(this);
		$(this).toggleClass("icon-eye-open")
		$(this).toggleClass("icon-eye-close")
		if(!$(this).parent().parent().next().hasClass("infoMeta")) {
			$('.infoMeta').remove()
			var link = driPath + "objects/" + $(this).attr("data-id");
			loadData(link, function(data) {
				displayData(data, item, link)
			});

		} else {
			$('.infoMeta').remove()
		}

	})
	
	$(document).on("click", "tr .collapse", function() {
		$(this).nextAll().toggle()
		$("i", this).toggleClass("icon-plus")
		$("i", this).toggleClass("icon-minus")
	})


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

			if(start + diff + amountPages <= meta.numPages) {
				endPage = start + diff + amountPages;
			} else {
				endPage = meta.numPages
			}
		} else {
			startPage = 1;
			if(meta.numPages < amountPages){
				endPage = meta.numPages;
			}else{
			endPage = amountPages;
			}
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
	//Add last page to the end if there are more pages then the amount of pages that are allowed to be displayed (config file)
	if((meta.numPages - currentPage) > (amountPages / 2) && meta.numPages > amountPages) {
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


function loadData(link, callback, error) {
	$.ajax({
		url : socket + link,
		cache : false,
		type : "GET",
		dataType : 'jsonp',
		timeout : 2000,
		success : function(data, status, r) {
			if(data.objects) {
				callback(data.objects, data.meta);
			} else {
				callback(data);
			}
		},
		error : function(x, h, r) {
			if(r == "timeout") {
				error("Connection to the API could not be established")
			} else {
				error(x)
			}
			console.log(x);

		}
	});

}


function createLoadingRow() {
	var tr = $(document.createElement('tr')).attr('id', 'loadingDiv')
	var loading = $(document.createElement('i')).addClass('icon-refresh')

	var td = $(document.createElement('td')).attr('colspan', '7').append(loading).text(" Loading...");
	tr.append(td)

	$('tbody').append(tr)
}


function displayData(data, item, link) {
	var root = "<table class='table-bordered infoFloat span6'>"
	root += "<tr class='collapse'><th colspan='2'><i class='icon-minus'></i><h2>General</h2></th></tr><tr><th>type</th><th>data</th>";
	for(var i in data) {

		if(i != "properties" && i != "fileLocation") {
			root += "<tr><td>" + i + "</td><td>" + data[i] + "</td><tr>"
		}

	}
	root +=  "<tr><td>Json</td><td><a href='"+socket+link+"' target='_blank'>" + link + "</a></td><tr>";
	if(data.properties != undefined){
	root +=  "<tr><td>Dulbin core</td><td><a href='"+socket+link+".dc' target='_blank'>" + link + ".dc</a></td><tr>";
	}
	if(data.fileLocation) {
		root += "</table><table class='table-bordered span6 infoFloat'><tr class='collapse'><th colspan='2'><i class='icon-plus'></i><h2>Files</h2></th></tr>";
		for(var i = 0; i < data.fileLocation.length; i++) {
			root += "<tr><td colspan='2'><a href='" + publicDirectory + "/" + data.fileLocation[i].fileLocation + "'>" + data.fileLocation[i].fileLocation + "</a></td></tr>";
		}
	}

	root += "</table>"
	var properties = "<table class='table-bordered infoFloat span6'><tr class='collapse'><th colspan='2'><i class='icon-plus'></i><h2>Properties</h2></th><tr>";
	for(var i in data.properties) {
		var obj = i;
		properties += "<tr><th colspan='2'><h3>" + i + "</h3></th><tr>";
		for(var j in data.properties[i]) {
			var info = data.properties[obj][j]
			for(i in info) {

				if( typeof info[i] == "object") {
					var info = info[i]
					for(var k in info) {
						properties += "<tr><th colspan='2'>" + k + "</th><tr>";
						for(l in info[k]) {

							properties += "<tr><td>" + l + "</td><td>" + info[k][l] + "</td><tr>"
						}
					}
				} else {
					properties += "<tr><td>" + i + "</td><td>" + info[i] + "</td><tr>"
				}
			}
		}
	}
	
	if(data.properties == undefined){
		properties += "<tr><td colspan='2'>None</td></tr>"
	}

	properties += "</table>"
	$(item).parent().parent().after("<tr class='infoMeta'><td colspan='7'>" + root+properties + "</td></tr>")
	$("tr .collapse").eq(0).nextAll().show()
	console.log($("tr .collapse").eq(0))
}
