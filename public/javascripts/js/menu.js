/**
 * @author mvanwamb
 */




/*function createPropertyButtons(){
	createJsonMenu();
	parentId = Math.floor(Math.random()*Math.random()*1000-1);
	var heading ='<div class="accordion" id="accordion'+parentId+'">';
	var previousGroup = "";
	var steps = buttons.length;
	for(var i =0;i<steps;i++){
		if(i != 0 && previousGroup != buttons[i][0]){
				var close ='</div></div></div>';
				heading += close;
			}
			if(buttons[i][0] != previousGroup){
				var random = Math.floor(Math.random()*Math.random()*1000-1);
				var group = '<div class="accordion-group"><div class="accordion-heading"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion'+parentId+'" href="#'+buttons[i][0]+random+'"> '+buttons[i][1] +'</a></div>';
				var inner = '<div id="'+buttons[i][0]+random+'" class="accordion-body collapse "><div class="accordion-inner">';
				var btn = '<button class="btn btn-small">'+buttons[i][2]+'</button><span class="type">'+buttons[i][3]+'</span>';
				
				if(buttons[i][3] == "select"){
					
					 btn +='<span class="selectData">'+buttons[i][4]+'</span>';
					
				}
				heading += group;
				heading += inner;
				heading += btn;
			}else{
				var btn = '<button class="btn btn-small">'+buttons[i][2]+'</button><span class="type">'+buttons[i][3]+'</span>';
				heading += btn;
			}
			
			previousGroup = buttons[i][0];
			if(i == steps -1){
				var close ='</div></div></div>';
				var end = '</div>';
				heading += close;
				heading += end;
				return heading;
			}
		
	}
}*/



var headAttributes = [{}]
var optionsArray = new Array();
function createPropertyButtons() {
	optionsArray = new Array();
	var p = driObjectSchema;
	
	$.each(p, function(index, obj) {
		optionsArray.push({
			name : index,
			value : obj
		});

	});
	console.log(optionsArray)
	parentId = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var heading = '<div class="accordion" id="accordion' + parentId + '">';
	var random = Math.floor(Math.random() * Math.random() * 1000 - 1);
	var group = '<div class="accordion-group"><div class="accordion-heading">' + '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion' + parentId + '" href="#group' + random + '">Properties</a></div>' + '<div id="group' + random + '" class="accordion-body collapse "><div class="accordion-inner">';
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
}


function getFunctionName(func) {
  if ( typeof func == "function" || typeof func == "object" )
  var fName = (""+func).match(
    /function\s*([\w\$]*)\s*\(/
  ); if ( fName !== null ) return fName[1];
}




