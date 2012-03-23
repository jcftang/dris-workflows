/**
 * @author mvanwamb
 */

$(document).ready(function() {

	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	$("#fileBox").hide();
	loadBtnActions();
	backbone();
	
});

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

