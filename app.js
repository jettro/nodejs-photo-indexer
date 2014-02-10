var exif = require('exif2');
var walk = require('walk');
var elasticsearch = require('elasticsearch');
var readline = require('readline');

var walker  = walk.walkSync('/Users/jettrocoenradie/Pictures/export/2013', { followLinks: false });

var client = new elasticsearch.Client({
	host: '192.168.1.10:9200',
	log:'trace'
});

walker.on('file', function(root, stat, next) {
	console.log("Walk " + stat.name);
    // Add this file to the list of files
    if (strEndsWith(stat.name.toLowerCase(),".jpg")) {
	    extractData(root + '/' + stat.name, next);
    }
    next();
});

walker.on('end', function() {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question("What do you think of node.js? ", function(answer) {
		console.log("Thank you for your valuable feedback:", answer);
  		rl.close();
		flushItems();
  		console.log("We are done!");
	});
    
});

function strEndsWith(str, suffix) {
    return str.match(suffix+"$")==suffix;
}

function extractData(file) {
	console.log("Extracting data");
	exif(file, function(err, obj){
		if(err) {
			console.log(err);
			callback();
		} else {
			console.log("Creating the object");
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
		}
	});	
}

var items = [];
function sendToElasticsearch(searchObj) {
	console.log("Sending to elastic");
	items.push({"index":{}});
	items.push(searchObj);
	if (items.length >= 100) {
		flushItems();
	}
}

function flushItems() {
	console.log("Flushing items");
	client.bulk({
		index: 'myimages',
		type: 'local',
		body: items
	}, function(err,response) {
		if (err) {
			console.log(err);
		}
		items = [];
	});
}