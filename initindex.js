var http = require('http');

deleteIndex();

var settings = require('./settings.json');
sendSettings(settings);

function deleteIndex() {
	var opts = {
		host: 'localhost',
		port: 9200,
		path: '/myimages',
		method: 'DELETE'
	};

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

	req.end();
}

function sendSettings(settings) {
	var searchString = JSON.stringify(settings);

	var headers = {
			'Content-Type': 'application/json',
			'Content-Length': searchString.length
	};

	var opts = {
		host: 'localhost',
		port: 9200,
		path: '/myimages',
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