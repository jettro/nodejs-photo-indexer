var exif = require('exif2');
var walk = require('walk');
var elasticsearch = require('elasticsearch');

var walker  = walk.walk('/Users/jcoenradie/Pictures', { followLinks: false });

var client = new elasticsearch.Client();

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    if (strEndsWith(stat.name,".jpg")) {
	    extractData(root + '/' + stat.name);
    }
    next();
});

walker.on('end', function() {
    console.log("We are done!");
});

function strEndsWith(str, suffix) {
    return str.match(suffix+"$")==suffix;
}

function extractData(file) {
	exif(file, function(err, obj){
		var searchObj = {};
		searchObj.name = obj["file name"];
		searchObj.camera = obj["camera model name"];
		searchObj.lens = obj["lens"];
		searchObj.iso = obj["iso"];
		searchObj.exposure = obj["exposure time"];
		searchObj.aperture = obj["f number"];
		searchObj.shutter = obj["shutter speed value"];
		searchObj.compensation = obj["exposure compensation"];
		searchObj.focalLength = obj["focal length"];
		searchObj.createDate = obj["date time original"];

		sendToElasticsearch(searchObj);
	});	
}

function sendToElasticsearch(searchObj) {
	client.index({
		index: 'myimages',
		type: 'local',
		body: searchObj
	}, function(err,response) {
		if (err) {
			console.log(err);
		} else {
			console.log(response);
		}
	});
}
