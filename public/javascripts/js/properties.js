/*
 * @author Matthias Van Wambeke
 */
var resourceTypes = ["text","cartographic","notated music",
"sound recording ","sound recording-musical",
"sound recording-nonmusical","still image",
"moving image","three dimensional object",
"software, multimedia","mixed material"];

var physicalDescriptionObjects = ["reformatted digital",
"born digital",
"digitized microfilm ",
"digitized other analog"];

var nameObjects = [
		"namePart" ,
		"displayForm" ,
		"affiliation" ,
		"role" ,
		"description"
];
 
var driObjectSchema = {
	titleInfo : {
		type:String,
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
	language:{
		languageTerm :String
	},
	physicalDescription:{
		extent:String,
		note: String,
		internetMediaType: String,
		digitalOrigin: String
	},
	abstract:{abstract:String},
	note:{
		type:String,
		note:String},
	subject: { topic: String,
		authority:String,
		name: String,
	},
	identifier:{identifier:String}
};




