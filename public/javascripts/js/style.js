/**
 * @author mvanwamb
 */
$(document).ready(function(){
	
	$("#step2,#step2Info").hide();
	
		loadBtnActions();
		backbone();
})
function loadBtnActions(){
		$("#titleBtn").click(function(){
			
			$(".form-actions").before('<div class="control-group"><label class="control-label" for="input01">Title</label><div class="controls"><input type="text" class="input-xlarge" id="input01" name="title"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
		});
		$("#subtitleBtn").click(function(){
			$(".form-actions").before('<div class="control-group"><label class="control-label">Subtitle</label><div class="controls"><input type="text" class="input-xlarge" name="subtitle"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
		});
		$(".accordion-heading").click(function(){
			$(".accordion-heading").removeClass("accordion-heading-focus");
			$(this).addClass("accordion-heading-focus");
		})
		$(".breaddisabled").click(function(){ return false});
		$('.btn').click(function(){
			$(".form-actions").show();
		})
		$(".breadcrumb a").click(function(){
			
			if(!$(this).hasClass("breaddisabled")){
			$(".breadcrumb a").parent().removeClass("active");
			$(this).parent().addClass("active");
			}
		});
		
	}
	
function backbone(){

	var Workspace = Backbone.Router.extend({
	
	  routes: {
	    "step1":        "help",    // #help
	    "step2":        "search",  // #search/kiwis
	   
	  },
	
	  help: function() {
	    $("#step1,#step2,#step1Info,#step2Info").hide();
	    $("#step1,#step1Info").show();
	  },
	
	  search: function() {
	  	$("#step1,#step2,#step1Info,#step2Info").hide();
	    $("#step2,#step2Info").show();
	    
	  }
	
	});
	var w = new Workspace();
	
	Backbone.history.start({root: "/Upload2/"})

	
}

