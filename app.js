var exif = require('exif2');
var http = require('http');
var walk = require('walk');

var walker  = walk.walk('/Users/jcoenradie/Pictures', { followLinks: false });

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
	var searchString = JSON.stringify(searchObj);

	var headers = {
			'Content-Type': 'application/json',
			'Content-Length': searchString.length
	};

	var opts = {
		host: 'localhost',
		port: 9200,
		path: '/myimages/local',
		method: 'POST',
		headers: headers
	};

	// Setup the request.  The options parameter is
	// the object we defined above.
	var req = http.request(opts, function(res) {
		res.setEncoding('utf-8');

		var responseString = '';

		res.on('data', function(data) {
			responseString += data;
		});

		res.on('end', function() {
			var resultObject = JSON.parse(responseString);
		});
	});

	req.on('error', function(e) {
	  console.log(e);
	});

	req.write(searchString);
	req.end();
}
