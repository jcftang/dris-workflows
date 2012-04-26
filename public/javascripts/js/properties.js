/*
 * @author Matthias Van Wambeke
 */
var resourceTypes = ["text","cartographic","notated music",
"sound recording ","sound recording-musical",
"sound recording-nonmusical","still image",
"moving image","three dimensional object",
"software, multimedia","mixed material"];

var physicalDescriptionObjects = ['born digital',
'reformatted digital',
'digitized microfilm ',
'digitized other analog'];

var nameObjects = [
		"namePart" ,
		"displayForm" ,
		"affiliation" ,
		"role" ,
		"description"
];
//categorieGroup,groupName,property,type
//No spaces in categorieGroup
/*
var buttons = [
	["collapseZero","Project Info","objectId","number"], 
	//----------------------------------------------//
	["collapseOne","Title Info","title","text"],
	["collapseOne","Title Info","subtitle","text"],
	["collapseOne","Title Info","partNumber","text"],
	["collapseOne","Title Info","partName","text"],
	["collapseOne","Title Info","nonSort","text"],
	//----------------------------------------------//
	["collapseTwo","Name ","namePart","text"],
	["collapseTwo","Name ","displayForm","text"],
	["collapseTwo","Name ","affiliation","text"],
	["collapseTwo","Name ","roleTerm","text"],
	["collapseTwo","Name ","description","text"],
	//----------------------------------------------//
	["collapseThree","typeOfResource","typeOfResource","select",createSelect(resourceTypes)],
	//----------------------------------------------//
	["collapseFour","genre","nonSort","text"],
	//----------------------------------------------//
	["collapseFive","originInfo","namePart","text"],
	//----------------------------------------------//
	["collapseSix","language","displayForm","text"],
	//----------------------------------------------//
	["collapseSeven","physicalDescription","affiliation","text"],
	//----------------------------------------------//
	["collapseEight","abstract","role","text"],
	//----------------------------------------------//
	["collapseNine","tableOfContents","description","text"],
	//----------------------------------------------//
	["collapseTen","Type of resource","type","text"],
	//----------------------------------------------//
	["collapseEleven","targetAudience","genre","text"],
	//----------------------------------------------//
	["collapseTwelve","note","genre","text"],
	//----------------------------------------------//
	["collapseThirteen","subject","genre","text"],
	//----------------------------------------------//
	["collapseFourteen","classification","genre","text"],
	//----------------------------------------------//
	["collapseFifteen","relatedItem","genre","text"],
	//----------------------------------------------//
	["collapseSixteen","identifier","genre","text"],
	//----------------------------------------------//
	["collapseSeventeen","location","genre","text"],
	//----------------------------------------------//
	["collapseEighteen","accessCondition","genre","text"],
	//----------------------------------------------//
	["collapseNineteen","part","genre","text"],
	//----------------------------------------------//
	["collapseTwenty","extension","genre","text"],
	//----------------------------------------------//
	["collapseTwentyOne","recordInfo","genre","text"]
	//----------------------------------------------//
 ]*/
 
 

function createSelect(items){
	var select = "<select>";
	for(var i in items){
		select += "<option>"+items[i]+"</option>";
	}
	select += "</select>"
	return select;
	
}



var driObjectSchema = {
	titleInfo : {
		title : String,
		subtitle : String,
		partNumer : String,
		nonSort : String
	},
	name : {
		namePart : String,
		displayForm : String,
		affiliation : String,
		role : String,
		description : String
	},
	typeOfResource : {
		typeOfResource : String
	},
	genre : {
		genre : String
	},
	originInfo : {
		place : String,
		publisher : String,
		dateIssued : String,
		dateCreated : String,
		dateCaptured : String,
		dateValid : String,
		dateModified : String,
		copyrightDate : String,
		dateOther : String,
		edition : String,
		issuance : String,
		frequency : String
	},
	physicalDescription:{
		extent:String,
		note: String,
		internetMediaType: String,
		digitalOrigin: String
	},
	abstract:{abstract:String},
	note:{note:String},
	subject: { topic: String,
		geographic: String,
		temporal: String,
		titleInfo: String,
		name: String,
		/*genre: String,*/
		hierarchicalGeographic: String,
		cartographics: String,
		geographicCode: String,
		occupation: String,
	},
	identifier:{identifier:String}
};




