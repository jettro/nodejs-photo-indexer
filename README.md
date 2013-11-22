nodejs-photo-indexer
====================

Using this project you can scan a directory structure for jpg files. Using the exiftool (see installation instructions later on) you can abstract meta-data from you images and insert them into elasticsearch. Then we have a few examples for analysing the metadata using kibana. You can reuse our kibana dashboards.

Installation
============

You need to install the following libraries. Instructions for installation are on the different websites.
* Exiftool : http://www.sno.phy.queensu.ca/~phil/exiftool/ (tested with version 9.41)
* Elasticsearch : http://www.elasticsearch.org/download (tested with version 0.09.7)
* Kibana : http://www.elasticsearch.org/overview/kibana/installation/ (tested with version 3 Milestone 4)
* Node.js : http://nodejs.org (tested with version 0.10.22)

Setup
=====

First we are going to check if your environment is setup right.

Elasticsearch -> Point your browser to http://localhost:9200, you should see a json object with some information about your cluster
Exiftool -> This must be available on your path, type exiftool, you should see the man page of exiftool now.
Node.js -> Check if node and npm are on your path, node -v and npm -v should present you the version that you have installed.
Kibana -> Kibana should be pointed to your elasticsearch server. For now I assume you have everything running on your local machine. You can copy all files from kibana to your webserver. I personally like to host it as an elasticsearch plugin. To do this, create a folder kibana/_site in the plugins folder of elasticsearch and copy all the kibana files here. Then point your browser to http://localhost:9200/_plugin/kibana and you should see the interface. Usually with a warning that it cannot find an index.

Now we can obtain the sources and run the program. Clone this repository if you are reading this online. Step into the folder and download the required libraries using npm.

> git clone git@github.com:jettro/nodejs-photo-indexer.git
> cd nodejs-photo-indexer
> npm install

After npm install you should have the folder node_modules with the modules exif2 and walk. The exif2 library is used as an interface to the exiftool library, walk is used to traverse a directory structure. Next step is to initialize the elasticsearch index. We have a node.js command for that.

> node initindex

Now you can check the mapping for the created index, browse to the following url (or use curl):
http://localhost:9200/myimages/local/_mapping?pretty

This should show you part of the content from the settings.json file. This is it, now is the moment you can start importing images. You can run the app nd provide the initial folder to start scanning.

> node app /path/to/your/Pictures

Now you should see the log showing which pictures it is indexing and which files it skips.

When you have your images in elasticsearch it is time to open kibana in a browser and load the dashbaord we have created.

What is next?
=============

I am writing a blog post about this sample (will post the url when it is finished). This blogpost contains an explanation of the node.js scripts, elasticsearch configuration and we will go into more details for creating the dashboard