var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	log:'trace'
});

deleteIndex();

function deleteIndex() {
	client.indices.delete({
		index: 'myimages'
	}, function(err,response) {
		console.log("Delete index!");
		if (err) {
			if (err.message === 'IndexMissingException[[myimages] missing]') {
				console.log('Index does not exist');
				sendSettings();
			} else {
				console.log(err);
			}
		} else {
			console.log(response);
			sendSettings();
		}
	});
}

function sendSettings(settings) {
	client.indices.create({
		index: 'myimages',
		body: {
			"index": {
		        "number_of_shards": 1,
		        "number_of_replicas": 0				
			},
	        "analysis": {
	            "analyzer": {
	                "keyword_lowercase": {
	                    "type": "custom",
	                    "tokenizer": "keyword",
	                    "filter": ["lowercase"]
	                }
	            }
	        }
		}
	}, function(err,response) {
		console.log("create index!");
		if (err) {
			console.log(err);
		} else {
			console.log(response);
			sendMapping();
		}
	});
}

function sendMapping() {
	client.indices.putMapping({
		index:'myimages',
		type:'local',
		body: {
            "_all": {
                "enabled": true
            },
            "properties": {
                "name": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "camera": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "lens": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                "createDate": {
                    "type": "date",
                    "format": "yyyy:MM:dd HH:mm:ss"
                },
                "iso": {
                    "type": "integer"
                }
            }
        }
	}, function(err,response) {
		console.log("Put mapping !");
		if (err) {
			console.log(err);
		} else {
			console.log(response);
		}
	});

}