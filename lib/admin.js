/**
 * @author Quirijn Groot Bluemink
 */
var res;
var helpers = require("./helpers");



exports.getSeries = function getSeries(req,res){
	
	helpers.getItemsByType("serie",function(array){		
		res.render('admin', 
			{title : "Admin series"
			, id:"getSeries"
			, series:array
			, layout:"_layouts/layoutAdmin"}
		)
	});
}

exports.getItems = function getItems(req,res){
	id = req.params.id;
	helpers.getSeriesItemsByID(id, function(array){		
		res.render('_includes/adminItems', 
			{title: "Admin series"
			, id: "getSeries"
			, series: array
			, layout: "_layouts/layoutAdmin"}
		)
	});
}
