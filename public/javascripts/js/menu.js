/**
 * @author mvanwamb
 */
var headAttributes = [{}]
var optionsArray = new Array();
function createPropertyButtons() {
	optionsArray = new Array();
	var scheme = driObjectSchema;
	
	$.each(scheme, function(index, obj) {
		optionsArray.push({
			name : index,
			value : obj
		});

	});
	parentId = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var heading = '<div class="accordion" id="accordion' + parentId + '">';
	
	var random2 = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var group2 = '<div class="accordion-group"><div class="accordion-heading">' + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion' 
	+ parentId + '" href="#project' + random2 + '">Project</a></div>' 
	+ '<div id="project' + random2 + '" class="accordion-body collapse "><div class="accordion-inner">'
	+ '<button class="btn btn-small">objectId</button>'
	+ '</div></div></div>';
	heading += group2;
	
	var random = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var group = '<div class="accordion-group"><div class="accordion-heading">'
	+ '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion' 
	+ parentId + '" href="#group' + random + '">Properties</a></div>' + '<div id="group' 
	+ random + '" class="accordion-body collapse "><div class="accordion-inner">';
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





