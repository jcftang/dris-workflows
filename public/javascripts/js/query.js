//Javascript for Query page
/*------------------------------------
 *           -- Query --
 *------------------------------------ */
function setUpQueryPage() {
	$("#query").click(function(e) {
		var field = $("#searchField").val()
		var value = $("#searchValue").val()
		if(field && value) {
			loadQueryData(field, value)
			$("#searchValue").removeClass("alert-error")
		}else{
			$("#searchValue").addClass("alert-error")
			console.log("Enter a value")
		}
	})
}

function loadQueryData(field, value) {
	console.log(field + " " + value)
	// Check if label code contains prefix
	if(field =="label" && value.indexOf("IN-") > -1) {
		// Remove the prefix
		value = value.substring(3)
	}
	
	loadData(driPath + "query?field=" + field + "&value=" + value, function(data) {
		displayQueryData(data)
	});
}

function displayQueryData(data) {
	$("tbody").empty()
	for(var i = 0, j = data.length; i < j; i++) {
		data[i]
		var title = "-"
		var label = "IN-" + data[i].label.substring(0, amountLblChars);
		console.log(data[i].properties)
		if(( typeof data[i].properties) != undefined) {
			if(data[i].properties.titleInfo) {
				if(data[i].properties.titleInfo[0]) {
					title = data[i].properties.titleInfo[0].title;
				}

			}
		}
		$("#step1 tbody").append("<tr id='" + data[i]._id + "'>" + "<td>" + "<a data-type='" + data[i].type + "'  href='#id/" + data[i]._id + "'>" + title + "</a>" + "<i data-id='" + data[i]._id + "'class='icon icon-eye-open'></i></td>" + "<td><a data-type='" + data[i].type + "'  href='#id/" + data[i]._id + "'>" + label + "</a></td>" + "<td>" + data[i].type + "</td>" + "action" + "</tr>")
	};
	if(data.length ==0){
		$("#step1 tbody").append("<tr><td colspan='3'>Nothing found.</td></tr>")
	}
}
