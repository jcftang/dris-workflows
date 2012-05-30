//Javascript for Query page
/*------------------------------------
 *           -- Query --
 *------------------------------------ */
function setUpQueryPage() {
	//if you press enter in the search box you start searching
	$("#searchValue").keypress(function(e) {
		if(e.which == 13) {
			initeSearch()
		}
	}); 
	
	$("#query").click(function(e) {
		initeSearch()
	})
}
function initeSearch(){
	var field = $("#searchField").val()
		var value = $("#searchValue").val()
		//if the user entered a value in the serachbox
		if(field && value) {
			loadQueryData(field, value)
			$("#searchValue").removeClass("alert-error")
		}else{
			$("#searchValue").addClass("alert-error")
		}
}
function loadQueryData(field, value) {
	$("tbody").empty()
	createLoadingRow("tbody");
	// Check if label code contains prefix
	if(field =="label" && value.indexOf("IN-") > -1) {
		// Remove the prefix
		value = value.substring(3)
	}
	
	loadData(driPath + "query?field=" + field + "&value=" + value, function(data) {
		displayQueryData(data)
	},function(err){
		$('#loadingDiv').empty()
		var td = $("<td>").attr('colspan', '6').addClass('alert-error').text(err)
		$('#loadingDiv').append(td)
	});
}

function displayQueryData(data) {
	$("tbody").empty()
	for(var i = 0, j = data.length; i < j; i++) {

		var title = "-"
		var label = "IN-" + data[i].label.substring(0, amountLblChars);
		titleCheck(data[i],function(title){
			var details = "<span class='details'><span class='divider'> |</span><a href='/overview/"+data[i]._id +"'>details</a></span>"
			$("#step1 tbody").append("<tr id='" + data[i]._id + "'>" + "<td>" + "<a data-type='" + data[i].type + "'  href='#id/" + data[i]._id + "'>" + title + "</a>" +details+ "<i data-id='" + data[i]._id + "'class='icon icon-eye-open'></i></td>" + "<td><a data-type='" + data[i].type + "'  href='#id/" + data[i]._id + "'>" + label + "</a></td>" + "<td>" + data[i].type + "</td></tr>")	
		});
		
	};
	if(data.length ==0){
		$("#step1 tbody").append("<tr><td colspan='3'>Nothing found.</td></tr>")
	}
}
