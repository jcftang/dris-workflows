/**
 * @author mvanwamb
 */

$(document).ready(function() {

	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	$("#fileBox").hide();
	loadBtnActions();
	backbone();
	$('#checkAll').click(function () {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$('#bulk-execute').click(function () {
		var action = $(this).prev().val();
		switch(action)
		{
		case "approve":
			console.log("Approve");
			$(this).prev().val("-1");
		  break;
		case "remove":
			console.log("Remove All");
			removeAllSelected();
			$(this).prev().val("-1");
			
		  break;
		default:
			console.log("Select an action");
		}
	});
	$('.removeItem').click(function () {
		$this = $(this)
		id = $(this).attr("data-id");
		
		var confirmDialog= confirm("Are you sure you want to continue?\nThis cannot be undone!");
		if (confirmDialog == true)
		{
			removeItem(id, function(id){
				$("#"+id).remove();
			})
		}

	});
		
});

function removeAllSelected(){
	var confirmDialog= confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if (confirmDialog == true)
	{
		$('#series-table tbody input:checked').each(function() {
			console.log($(this).attr("data-id"));
			removeItem($(this).attr("data-id"), function(id){
				$("#"+id).remove();
			})
		});
	}

}
function removeItem(id, callback){
	$.ajax({
		url : "/remove/item/"+id,
		success : function(data) {
			callback(id);
		},
		error:function(d,r){
			console.log(d);
			console.log(r);
		}
	});
}

function loadAllSeries(){
	createSeriesTableHead();
	$.ajax({
		url : "series",
		success : function(data) {
			for(i in data){
				$row = $("<tr>");

				$checkboxCell = $("<td>");
				$nameCell = $("<td>");
				$authorCell = $("<td>");

				$checkbox = $("<input>");
				$checkbox.attr("name", "series");
				$checkbox.attr("type", "checkbox");
				$checkboxCell.append($checkbox);

				$name = $("<a>");
				$name.text(data[i].name);
				$name.attr("class", "view-children");
				$name.attr("data-id", data[i]._id);
				$name.attr("href", "admin/"+data[i]._id);
				$nameCell.append($name);

				$authorCell.text(data[i].author);

				$row.append($checkboxCell);
				$row.append($nameCell);
				$row.append($authorCell);
				$('#series-table').append($row);
			}
		},
		error:function(d,r){
			console.log(d);
			console.log(r);
		},
		complete:function(d,r){
			console.log("Series loaded");
			$(".view-children").click(function(){
  				//event.preventDefault();
				console.log("Clicked series");
  				//history.pushState({ path: this.path}, '',$(this).attr("href"))
				$id = $(this).attr("data-id");
				
				/*$('#series-table').fadeOut(function() {
					loadAllItemsOfSeries($id);
				});*/


			});
		}
	});
}
function createSeriesTableHead(){	
	$('#series-table').empty();
	$head = $("<thead>");
	$row = $("<tr>");
	
	$checkboxCell = $("<th>");
	$nameCell = $("<th>");
	$authorCell = $("<th>");
	
	$checkboxCell.attr("class", "span1");	
	$checkbox = $("<input>");
	$checkbox.attr("name", "series");
	$checkbox.attr("type", "checkbox");
	$checkboxCell.append($checkbox);
				
	$nameCell.text("Name");

	$authorCell.text("Author");
	
	$row.append($checkboxCell);
	$row.append($nameCell);
	$row.append($authorCell);
	
	$head.append($row);
	
	$('#series-table').append($head);
	
}
function loadAllItemsOfSeries(id){
	createItemsTableHead();
	console.log(id);
	$.ajax({
		url : "/items/" + id,
		success : function(data) {
			for(i in data){
				$row = $("<tr>");

				$checkboxCell = $("<td>");
				$nameCell = $("<td>");
				$authorCell = $("<td>");

				$checkbox = $("<input>");
				$checkbox.attr("name", "item");
				$checkbox.attr("type", "checkbox");
				$checkboxCell.append($checkbox);

				$name = $("<a>");
				$name.text(data[i].Title);
				$nameCell.append($name);

				$authorCell.text(data[i].Subtitle);

				$row.append($checkboxCell);
				$row.append($nameCell);
				$row.append($authorCell);
				$('#series-table').append($row);
			}
		},
		error:function(d,r){
			console.log(d);
			console.log(r);
		},
		complete:function(d,r){
			console.log("Items loaded");
			$('#series-table').fadeIn();
		}
	});
}
function createItemsTableHead(){	
	$('#series-table').empty();
	$head = $("<thead>");
	$row = $("<tr>");
	
	$checkboxCell = $("<th>");
	$nameCell = $("<th>");
	$authorCell = $("<th>");
	
	$checkboxCell.attr("class", "span1");	
	$checkbox = $("<input>");
	$checkbox.attr("name", "series");
	$checkbox.attr("type", "checkbox");
	$checkboxCell.append($checkbox);
				
	$nameCell.text("Title");

	$authorCell.text("Subtitle");
	
	$row.append($checkboxCell);
	$row.append($nameCell);
	$row.append($authorCell);
	
	$head.append($row);
	
	$('#series-table').append($head);
	
}
function makeList(id, callback){
	$.ajax({
		url : "items/" + id,
		success : function(data) {
			$ul = $("<ul>");
			for(i in data){
				$li = $("<li>");
				
				$label = $("<label>");
				$label.attr("class","checkbox");
				$label.text(data[i].Title)
				
				$input = $("<input>");
				$input.attr("id","series");
				$input.attr("type","checkbox");
				$input.attr("name","series");
				$label.append($input);
				
				$li.append($label);
				
				$ul.append($li);
			}
			
			$('#'+id).append($ul);
		},
		error:function(d,r){
			console.log(d);
			console.log(r);
		},
		complete:function(d,r){
			console.log("done");
		}
	});

	
}
function showItems(items){
	var root = "";
	for(i in items){
	  root+= "<li><a href='item/"+items[i]._id+"'>"+items[i].Title+"</a></li>";
	}
	
	$("#items ul").empty();
	$("#items ul").append(root);
	
	$("#items ul li a").click(function(event) {
		event.preventDefault();
		$("#items ul").removeClass("in");
		$.ajax({
			url : this.pathname,
			success : function(data) {
				fillUpForm(data);
				$("#items ul").addClass("in");
			},
			error : function(d, r) {
				console.log(d);
				console.log(r);
			}
		});
	});
}
function fillUpForm(data){
	$(".dataform").empty();
	for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
        $(".dataform").append('<div class="control-group"><label class="control-label">'+prop+'</label><div class="controls"><input type="text" class="input-xlarge" id="input01" name="'+prop+'" value="'+data[prop]+'"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    }
}
}
function loadBtnActions(){

		$("#properties button").click(function(){
			$(".dataform").append('<div class="control-group"><label class="control-label">'+$(this).text()+'</label><div class="controls"><input type="'+$(this).next().text()+'" class="input-xlarge" id="input01" name="'+$(this).text()+'"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
		});
		$(".accordion-heading").click(function(){
			$(".accordion-heading").removeClass("accordion-heading-focus");
			$(this).addClass("accordion-heading-focus");
		})
		$(".breaddisabled").click(function(){ return false});

		$(".breadcrumb a").click(function(){
			
			if(!$(this).hasClass("breaddisabled")){
			$(".breadcrumb a").parent().removeClass("active");
			$(this).parent().addClass("active");
			}
		});
		$(".pager a").click(function(){
			
			
			$(".breadcrumb a").parent().removeClass("active");
			link = $(this).attr("href");
			$(".breadcrumb").find("a").each(function(index){
				if($(this).attr("href") == link){
					$(this).removeClass("breaddisabled")
					$(this).parent().addClass("active");
				}
			});
			
		});
		$("#surcheck").click(function(){
				$("#fileBox").toggle();
		})
		
		$("#subItem").click(function(){
			$("#itemCreation").submit();
		})
		
		$('#step3EditBtn').click(function(){
			$.ajax({
			url : this.pathname,
			success : function(data) {
				fillUpForm(data);
				$("#items ul").addClass("in");
			},
			error : function(d, r) {
				console.log(d);
				console.log(r);
			}
		});
		})

}
	
function backbone(){

	var Workspace = Backbone.Router.extend({
	initialize: function(){
			$("#items").hide();
	},
	  routes: {
	    "step1":        "step1",    // #help
	    "step2":        "step2",  // #search/kiwis
	    "step3":        "step3", 
	    "step4":        "step4", 
	   
	  },
	
	  step1: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#items").hide();
	    $("#step1,#step1Info").show();
	  },
	
	  step2: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step2,#step2Info,#items").show();
	    
	  },
	  step3: function(){
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step3,#step3Info,#items").show();
	  },
	  step4: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#items").hide();
	    $("#step4,#step4Info").show();
	    
	  },
	
	});
	var w = new Workspace();
	
	Backbone.history.start({root: "/Upload2/"})

	
}

