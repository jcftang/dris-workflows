/**
 * @author mvanwamb
 */

$(document).ready(function() {
	

	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	$("#fileBox").hide();
	loadBtnActions();
	backbone();
	if(window.location.pathname == "/edit"){
		loadAllItems();
	}
});

function loadAllItems(){

	

	loadAllItemsByType("collections", function(root) {
		var list = "<optgroup label='collections'>";
		list += root;
		list += "</optgroup>";
		$("#itemEditSelection").append(list);
	})
	loadAllItemsByType("series", function(root) {
		var list = "<optgroup label='series'>";
		list += root;
		list += "</optgroup>";
		$("#itemEditSelection").append(list);
	})
	loadAllItemsByType("items", function(root) {
		var list = "<optgroup label='items'>";
		list += root;
		list += "</optgroup>";
		$("#itemEditSelection").append(list);
		$("#itemEditSelection").chosen();
	})
	
}

function loadAllItemsByType(type,callback){

	loadData("/" + type, function(items) {
		var root = "";
		if(items.length == 0) {
			if(type == "series") {
				root = "<option>No series</option>";
			}
			if(type == "collections") {
				root = "<option>No collections</option>";
			}
				if(type == "items") {
				root = "<option>No items</option>";
			}
			
		}

		for(i in items) {
			console.log(items);
			root += "<option value='"
			if(type == "series") {
				root += items[i]._id + "'>" + items[i].name + " (" + items[i].author+")";
			}
			if(type == "collections") {
				root += items[i]._id + "'>" + items[i].name;
			}
				if(type == "items") {
				root += items[i]._id + "'>" + items[i].Title + " ("+items[i].objectId+")";
			}
			root += "</option>";
		}

		callback(root);
	});


}
function showItems(items){
	var root = "";
	if(items.length ==0){
		root = "<li>No items</li>";
	}
	for(i in items){
	  root+= "<li><a href='item/"+items[i]._id+"'>"+items[i].Title+" "+items[i].objectId+"</a></li>";
	}
	
	$(".items ul").empty();
	$(".items ul").append(root);
	

}
function loadData(link,callback){
	$.ajax({
				url : link,
				success : function(data) {
					callback(data);
				},
				error : function(d, r) {
					console.log(d);
					console.log(r);
				}
			});
}

function fillUpForm(data) {
	$(".dataform").empty();
	for(var prop in data) {
		if(data.hasOwnProperty(prop)) {
			$(".dataform").append('<div class="control-group"><label class="control-label">' + prop + '</label><div class="controls"><input type="text" class="input-xlarge" id="input01" name="' + prop + '" value="' + data[prop] + '"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
		}
	}
}

function loadBtnActions(){

	$("#step2Btn").click(function() {

		$.ajax({
			url : "items/" + $("#step1 select").val(),
			success : function(data) {
				showItems(data);
			},
			error:function(d,r){
				console.log(d);
				console.log(r);
			}
		});
	})
	
	$("#properties button").click(function() {
		addInputFieldToFrom(this);
		
	});
	$(".accordion-heading").click(function() {
		$(".accordion-heading").removeClass("accordion-heading-focus");
		$(this).addClass("accordion-heading-focus");
	})
	$(".items li").live("click",function() {
		$(".items li").removeClass("accordion-heading-focus");
		$(this).addClass("accordion-heading-focus");
		$(".items li").eq($(this).index()).addClass("accordion-heading-focus");
		$("#list2 li").eq($(this).index()).addClass("accordion-heading-focus");
	})
	
	$(".breaddisabled").click(function() {
		return false
	});

	$(".breadcrumb a").click(function() {

		if(!$(this).hasClass("breaddisabled")) {
			$(".breadcrumb a").parent().removeClass("active");
			$(this).parent().addClass("active");
		}
	});
	$(".pager a").click(function() {

		$(".breadcrumb a").parent().removeClass("active");
		link = $(this).attr("href");
		$(".breadcrumb").find("a").each(function(index) {
			if($(this).attr("href") == link) {
				$(this).removeClass("breaddisabled")
				$(this).parent().addClass("active");
			}
		});
	});
	$("#surcheck").click(function() {
		$("#fileBox").toggle();
	})

	$("#creatItem,#editItem1,#editItem2").click(function() {
		$("#itemCreation").submit();
	})

	$("#createSerieBtn").click(function() {
		$("#serieCreation").submit();
		loadAllItemsByType("series",function(root){
			$("#seriesItemCreation").empty();
			$("#seriesItemCreation").append(root);
			$("#seriesItemCreation").chosen();
		})
	})

	$("#createCollectionBtn").click(function() {
		$("#collectionCreation").submit();
	})

	$('#step3EditBtn').click(function() {
		loadAllImages($("input[name='_id']").val());
	})

	$("#step3Info .items ul li a").live("click", function(event) {

		event.preventDefault();
		loadData(this.pathname,function(data){
			fillUpForm(data)
		});
		loadAllImages($(this).attr("href").substring($(this).attr("href").indexOf("/") + 1));
	});
	$("#step2Info .items ul li a").live("click",function(event) {
		event.preventDefault();
		loadData(this.pathname,function(data){
			fillUpForm(data)
		});
	});

	$("#createItems").live("click", function(event) {
		loadAllItemsByType("series",function(root){
			$("#seriesItemCreation").empty();
			$("#seriesItemCreation").append(root);
			$("#seriesItemCreation").chosen();
		})

		loadAllItemsByType("items", function(root) {
			$(".itemItems").empty();
			$(".itemItems").append(root);
			$(".itemItems").chosen();
		})

		emptyForm();
	});
	$("#createSerie,#createItems").live("click", function(event) {
		loadAllItemsByType("collections",function(root){
			$(".seriesCollection").empty();
			$(".seriesCollection").append(root);
			$(".seriesCollection").chosen();
		})
		emptyForm();
	});
	
	$("#createCollection,#createSerie").live("click", function(event) {
		emptyForm();
	});	
	

	$(".nextItemBtn").click(function() {
		urlNextItem = $(".items li.accordion-heading-focus").next().find("a").attr("href");
		nextItem = $(".items li.accordion-heading-focus").next();
		if(!nextItem.is("li")) {
			nextItem = $(".items li:first");
			urlNextItem = $(".items li:first").find("a").attr("href");
		}
			nextItem.siblings().removeClass("accordion-heading-focus");
			nextItem.addClass("accordion-heading-focus");
			loadData(urlNextItem, function(data) {
				fillUpForm(data)
			});
		
	})



	$(".previousItemBtn").click(function() {
		urlPrevItem = $(".items li.accordion-heading-focus").prev().find("a").attr("href");
		prevItem = $(".items li.accordion-heading-focus").prev();
		if(!prevItem.is("li")) {
			prevItem = $("#step2Info  .items li:last");
			urlPrevItem = $("#step2Info .items li:last").find("a").attr("href");	
			console.log(prevItem);		
		}
		prevItem.siblings().removeClass("accordion-heading-focus");
		prevItem.addClass("accordion-heading-focus");
			loadData(urlPrevItem, function(data) {
				fillUpForm(data)
			});
	})

}
function emptyForm(){
	$(".dataform").empty();
}
function addInputFieldToFrom(btn){
	var input = '<div class="control-group"><label class="control-label">' + $(btn).text() + '</label><div class="controls">';
	if($(btn).next().text() == "select"){
		input +=  $(btn).next().next().html();
	}else{
	input += '<input type="' + $(btn).next().text()+ '" class="input-xlarge" id="input01" name="'+ $(btn).text() + '">';
	}
	input += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
	$(".dataform").append(input);
}

function loadAllImages(id){
	loadData("images/" + id + "/list", function(data) {
		for(var file in data) {
			$("#imageContainer").append("<img src='/image/" + data[file]._id + "/" + data[file].filename + "'>")
		}
	});
}
	
function backbone(){

	var Workspace = Backbone.Router.extend({
	  routes: {
	  	"edit":         "step2",
	    "step1":        "step1",    // #help
	    "step2":        "step2",  // #search/kiwis
	    "step3":        "step3", 
	    "step4":        "step4"
	   
	  },
	
	  step1: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step1,#step1Info").show();
	  },
	
	  step2: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step2,#step2Info").show();
	    
	  },
	  step3: function(){
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step3,#step3Info").show();

	  },
	  step4: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step4,#step4Info").show();
	    
	  }
	
	});
	var w = new Workspace();
	
	Backbone.history.start();

	
}
