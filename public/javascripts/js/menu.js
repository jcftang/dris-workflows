/**
 * @author mvanwamb
 */

/*
 * HOW IT WORKS:
 * This file loads in the schema from properties.js (same schema as in mongoose)
 * Here the properties drop down gets generated
 * In style.js the properties that are clicked are being generated and added to the form.
 * MORE INFO: in docs - menu.txt
 */
var optionsArray = new Array();
function createPropertyButtons() {
	optionsArray = new Array();
	//loads in the schema from properties.js, same schema is being used by mongoose.
	var scheme = driObjectSchema;
	//pushes the schema into an array
	$.each(scheme, function(index, obj) {
		optionsArray.push({
			name : index,
			value : obj
		});

	});
	//creating random numbers to make sure the item has a unique id
	//creating all the buttons and dropdown properties list
	parentId = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var heading = '<div class="accordion" id="accordion' + parentId + '">';
	
	var random2 = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var group2 = '<div class="accordion-group"><div class="accordion-heading">' + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion' 
	+ parentId + '" href="#project' + random2 + '">Project</a></div>' 
	+ '<div id="project' + random2 + '" class="accordion-body collapse "><div class="accordion-inner">';
	heading += group2;

	for(var i = 0; i < projectItems.length; i++) {
		heading += '<button class="btn btn-small">' + projectItems[i] + '</button>';

	}
	heading += '</div></div></div>'; 

	
	var random = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var group = '<div class="accordion-group"><div class="accordion-heading accordion-heading-focus">'
	+ '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion' 
	+ parentId + '" href="#group' + random + '">Properties</a></div>' + '<div id="group' 
	+ random + '" class="accordion-body in collapse "><div class="accordion-inner">';
	heading += group;
	for(var i = 0; i < optionsArray.length; i++) {
		var btn = '<button class="btn btn-small">' + optionsArray[i].name + '</button>';
		heading += btn;

		if(i == optionsArray.length - 1) {
			var close = '</div></div></div>';
			var end = '</div>';
			heading += close;
			heading += end;
			return heading;
		}
	}
	return heading;
}




