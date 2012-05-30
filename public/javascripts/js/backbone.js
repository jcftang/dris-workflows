//This is the backbone structure for following pages: ALL, EDIT, CREATE
/*------------------------------------
 *           -- Backbone --
 *------------------------------------ */

function backbone() {

	var Workspace = Backbone.Router.extend({
		//hashes in the url that are to be matched with
		routes : {
			"edit" : "step2",
			"myModal/:page" : "loadPidTop2",
			"edit/:id" : "editObject",
			"step2" : "step2",
			"step3" : "step3",
			"step4" : "step4",
			"step5" : "step5",
			"pd/:id" : "loadPid",
			"/:page" : "collectionPage",
			"id/:id" : "defaultRoute",
			"id/:id/:page" : "pageRoute",
			"pd/:id/:page" : "pageRoutePid",
			"myModal" : "loadPidTop",
			"" : "collection",
		},
		editObject:function(id){
			
			loadData(driPath + "objects/" + id, function(data) {
				emptyForm();
				fileUploadLocation = [];
				showItems([data])
				editItems = [data];
				$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step2,#step2Info,#single").show();
			$("#properties").show();
				$(".breadcrumb a").not("form .breadcrumb a").parent().removeClass("active");
				$(".breadcrumb a").not("form .breadcrumb a").eq(1).parent().addClass("active");
				$(".items li:first a").trigger("click");
			});
		},
		step2 : function() {
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step2,#step2Info,#single").show();
			$("#properties").show();
			loadpIdData();
			if(goDeeper) {
				goDeeper = false;
			} else {
				//removing the breadcrumbs at lower level
				//this is for the breadcrumbs at the change parent option
				if($(".modal .breadcrumb li").size() >= 1) {
					$(".modal .breadcrumb li:last").remove();
					$("#goUp").attr("disabled", "disabled");
				}
			}
		},
		step3 : function() {
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step3,#step3Info").show();
			$("#properties").show();

		},
		step4 : function() {
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step4,#step4Info").show();
			$("#properties").show();

		},
		step5 : function() {
			$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
			$("#step5,#step5Info").show();

		},
		collection : function() {
			$("tbody").empty();
			if(!goDeeper) {
				//removing the breadcrumbs at lower level
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			if(window.location.pathname != "/all") {
				loadTopLevelData(1, itemsPerPage);
			}
			resetCreatePage()
		},
		collectionPage : function(page) {
			loadTopLevelData(page, itemsPerPage);
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:last").remove();
				}
			}
			goDeeper = false;
		},
		defaultRoute : function(id) {
			if(goDeeper) {
				$("form .breadcrumb a:last").parent().removeClass("active");
				$(".row .breadcrumb").append("<li class='active'><a href='#id/" + id + "'>" + parentType + ": " + currentParentName + "</a><span class='divider'>/</span></li>");
				goDeeper = false;
			} else {
				$(".row .breadcrumb li:last").remove();
				$("form .breadcrumb a:last").parent().addClass("active");
			}
			resetCreatePage();
			$("#createCollection").hide();
			loadChildren(id, 1, itemsPerPage);

		},
		//Loads objects with no parent for the option to change parent
		loadPidTop : function() {
			$(".modal  tbody").empty();
			if(!goDeeper) {
				if($(".modal .breadcrumb li").size() > 1) {
					$(".modal  .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			loadpIdData(1, itemsPerPage);
		},
		//Loads objects with no parent for the option to change parent if there are pages
		loadPidTop2 : function(page) {
			$(".modal  tbody").empty();
			if(!goDeeper) {
				if($(".modal .breadcrumb li").size() > 1) {
					$(".modal  .breadcrumb li:first").nextAll().remove();
				}
			}
			goDeeper = false;
			loadpIdData(page, itemsPerPage);
		},
		//loads in children for the option to change parent id
		loadPid : function(id) {
			if(goDeeper) {
				$(".modal .breadcrumb a:last").parent().removeClass("active");
				$(".modal .breadcrumb").append("<li class='active'><a href='#pd/" + id + "'>" + parentType + ": " + currentParentName + "</a><span class='divider'>/</span></li>");
				$("#goUp").removeAttr("disabled");
				goDeeper = false;
			} else {
				$("#goUp").removeAttr("disabled");
				$(".modal .breadcrumb li:last").remove();
				$(".modal .breadcrumb a:last").parent().addClass("active");
			}
			loadPidChildren(id, 1, itemsPerPage);
		},
		//loads children if you change page
		pageRoute : function(id, page) {
			loadChildren(id, page, itemsPerPage);
		},
		//loads children for the change parent option if you change page
		pageRoutePid : function(id, page) {
			loadPidChildren(id, page, itemsPerPage);
		},
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}

function resetCreatePage() {
	$("#createCollection").show();
	$("#step1,#step2,#step2Info,#step3,#step3Info,#step4,#step4Info,#step5,#step5Info").hide();
	$("#step1").show();
	$("#properties").hide();
}