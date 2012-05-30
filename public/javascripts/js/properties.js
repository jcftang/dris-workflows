/*
 * author Matthias Van Wambeke
 */
//These arrays containt the data for specific fields, the variables name are the same as the names used in the schema
var resourceTypes = ["text", "cartographic", "notated music", "sound recording ", "sound recording-musical", "sound recording-nonmusical", "still image", "moving image", "three dimensional object", "software, multimedia", "mixed material"]; 

var titleType = ["title","alternative","abbreviated","translated"];
var nameType = ["personal","corporate","conference"];
var nameAuth = ["naf","ulan","local"];
var nameRole = ["arc","art" ,"asn","aut","col","cmp","ctg","dnr","dte","egr","ill","ppm","prt","scl","srv","trl"];
var genres = ["advertisements", "albums", "architecture (object genre)", "artifacts (object genre)", "books", "clippings (information artifacts)", "diaries", "drawings (visual works)", "ephemera", "field ", "notes", "illuminated ", "manuscripts", "journals (periodicals)", "landscapes (representations)", "manuscripts (document genre)", "maps", "documents", "music", "paintings (visual works)", "pamphlets", "photographs", "postcards", "posters", "prints (visual works)", "scores", "sheet music"]

var dateOther = ["beginning", "completion", "circa"];

var languages = ["English", "Irish", "French", "Spanish", "German", "Italian", "Chinese", "Latin", "Greek", "Russian", "Welsh"];

var physcialDescriptionType = ["condition", "medium", "support", "marks", "organization", "physical description", "physical details", "presentation", "script", "technique"]
var physicalDescriptionObjects = ["reformatted digital", "born digital", "digitized microfilm ", "digitized other analog"]; 

var mediaTypes = ["image/tiff", "image/jpeg"]
var abstractType = ["text", "link"]; 


var noteType = ["acquisition", "bibliographic history", "bibliography", "content", "exhibitions", "funding", "numbering", "publications", "restriction"]

var nameObjects = ["type", "authority", "name"];
var subjectAuth = ["lcsh","aat","lctgm","local"];

var identifiertype = ["dris", "DRIS_FOLDER", "lcn", "calm ","doi", "hdl","uri", "isbn","lccn","issn"]

var relatedType = ["series","host","project"];
var accessConditions = ["restriction on access", "use and reproduction","use and reproduction (link)"]

var projectItems = ["objectId","upload"];

//data schema same as in mongoose
var driObjectSchema = {
	titleInfo : {
		type:String,
		title : String,
		subtitle : String,
		partNumber : String,
		nonSort : String
	},
	name : {
		type : String,
		name : String,
		authority : String,
		role : String
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
		dateCaptured : String,
		dateValid : String,
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
		type:String,
		extent:String,
		note: String,
		internetMediaType: String,
		digitalOrigin: String
	},
	abstract:{abstract:String},
	note:{
		type:String,
		note:String},
	tableOfContents:{
		type:String,
		text:String
	},	
	subject: { 
		name: String,
		topic: String,
		
	},
	relatedItem:{
		type:String,
		title:String	
	},
	identifier:{
		type:String,
		identifier:String
	},
	location:{
		physicalLocation:String,
		shelfLocator:String,
		enumerationAndChronology:String,
		url:String
	},
	accessCondition:{
		accessCondition:String
	}
};





