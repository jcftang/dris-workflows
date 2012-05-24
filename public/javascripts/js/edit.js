//Javascript for EDIT page
/*------------------------------------
*           -- EDIT --
*------------------------------------ */

//updates all the objects that were selected at step1 in the edit page

function updateChildren(data, itemPos) {
	if(itemPos < data.length) {
		var link = socket + driPath + "objects/" + data[itemPos]._id + "/update";
		createMetaDataModels('#globalData', function(items) {
			if( typeof data[itemPos].properties == "undefined") {
				data[itemPos].properties = {}
			}
			//updating the properties of all the items that you selected

			for(var j in items) {
				console.log(data[itemPos])
				data[itemPos].properties[j] = items[j]
			}
			//sending the new data to the server
			updateData('POST', {
				"properties" : data[itemPos].properties
			}, link, function(id) {
				itemPos++;
				updateChildren(data, itemPos)
			});
		})
	} else {
		//displays the update message
		$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
		loadEditObjects()
	}
}

function loadEditData() {
	$(document).on("click", ".editRow", function() {
		loadData(driPath + "objects/" + $(this).attr("data-id"), function(data) {
			emptyForm();
			fileUploadLocation = [];
			showItems([data])
			editItems = [data];
			workspace.navigate("#step2", {
				trigger : true
			});
			$(".breadcrumb a").not("form .breadcrumb a").parent().removeClass("active");
			$(".breadcrumb a").not("form .breadcrumb a").eq(1).parent().addClass("active");
			$(".items li:first a").trigger("click")

		});
	})

	$("#step2 #single form input").live("blur", function() {

		$(".items li.accordion-heading-focus").addClass("changedItem");
		var pos = $(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")
		createMetaDataModels("#singleData", function(data) {
			editItems[pos].properties = data;
		})
	});

	$("#saveAll").click(function() {
		for(var i = 0; i < editItems.length; i++) {
			var link = socket + driPath + "objects/" + editItems[i]._id + "/update";
			var data = editItems[i];
			delete editItems[i]._id;
			updateData('POST', data, link, function(id) {
				loadEditObjects();
				$(".updatebox").fadeIn(300).delay(1500).fadeOut(400);
			})
		}
	})

	$("#goUp").click(function(event) {
		event.preventDefault();
		if($(this).is(':disabled') == false) {
			history.back();
		}
	})
	$("#pidSelect").click(function(event) {
		event.preventDefault();
		var id = $('input[type=radio]:checked').attr("data-id");
		$("div.pId").text(id);
		$("#myModal").modal("hide");
		var pos = $(".items li.accordion-heading-focus").attr('data-pos');
		workspace.navigate("#step2")

		editItems[pos].parentId = id;
	})
	$("#pIdBtn").click(function() {
		$('#myModal').modal()
		workspace.navigate("#myModal", {
			trigger : true
		});
		loadpIdData(1, itemsPerPage);
	})
	$("#gblUpdate").click(function(event) {
		event.preventDefault()
		updateChildren(editItems, 0);
	})
	$("#gblEdit").click(function(event) {
		event.preventDefault();
		$(".controls").hide();
		emptyForm();
		$("#boxFiles").remove();
		$(".items li").removeClass("accordion-heading-focus");
		$("#multi").show();
		$("#single").hide();
	})
	$('#checkAll').live('click', function() {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$("#step2Btn,#step2Btn2").click(function(event) {
		if($('tbody input:checked').size() > 0) {
			$(".controls").show();
			loadEditObjects();
			fileUploadLocation = [];
			$(".breadcrumb a").not("form .breadcrumb a").parent().removeClass("active");
			$(".breadcrumb a").not("form .breadcrumb a").eq(1).parent().addClass("active");
		} else {
			event.preventDefault();
		}

	})
}

function loadEditObjects() {
	var size = $('#step1 tbody input:checked').size()
	var arr = new Array();
	$(".pId").text("None");
	var objects = $('#step1 tbody input:checked');

	for(var i = 0; i < objects.length; i++) {
		loadData(driPath + "objects/" + $(objects[i]).attr("data-id"), function(data) {
			arr.push(data);
			if(arr.length == size) {
				emptyForm();
				showItems(arr)
				editItems = arr;
				$(".items li:first a").trigger("click")
			}
		});

	};
}