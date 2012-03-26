/**
 * @author mvanwamb
 */



/*var group = '<div class="accordion-group"><div class="accordion-heading"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#'+categorieGroup+'"> '+categorieGroup +'</a></div>';
var inner = '<div id="'+categorieGroup+'" class="accordion-body collapse "><div class="accordion-inner">';
var btn = '<button class="btn btn-small">'+property+'</button><span class="type">'+type+'</span>';
var close ='</div></div></div>';
var end = '</div>';*/





function createPropertyButtons(){
	var heading ='<div class="accordion" id="accordion2">';
	var previousGroup = "";
	var steps = buttons.length;
	for(var i =0;i<steps;i++){
		if(i != 0 && previousGroup != buttons[i][0]){
				var close ='</div></div></div>';
				heading += close;
			}
			if(buttons[i][0] != previousGroup){
				var group = '<div class="accordion-group"><div class="accordion-heading"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#'+buttons[i][0]+'"> '+buttons[i][1] +'</a></div>';
				var inner = '<div id="'+buttons[i][0]+'" class="accordion-body collapse "><div class="accordion-inner">';
				var btn = '<button class="btn btn-small">'+buttons[i][2]+'</button><span class="type">'+buttons[i][3]+'</span>';
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
}
