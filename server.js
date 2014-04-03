var fs = require('fs');		//Filesystem to read and write to files
var json2csv = require('json2csv');		//Used to export json to csv file. Slightly modified to deal with nested objects
var express = require('express');		//Used to create a webserver to serve an HTML page
var io = require('socket.io');			//Used to communicate between the client and server
var http = require('http');				//Needed to server webpages with express
var app = express();					//Creates an express application with the name app
var server = http.createServer(app);	//Create a webserver with the extended functionality of express
var twitter = require('ntwitter');		//Used to connect to the twitter API and gather tweets 
var twit = new twitter({
	consumer_key: '5UMbMiZmyfmZIv4w4wIvA',
	consumer_secret: '4XbLRKae0JnngpHyvgXm1K0dnmHYjKGwsZhHrfychy0',
	access_token_key: '110624472-7wxnUD6uIdDYnwLAEIucjtVe1jn6oMWgwd4Oytmp',
	access_token_secret: 'wfgF941yxA0xt2eg6QPUPpI2p5KBCJY3j9OOhir3gsFHF'
});										//Twitter API credentials

app.get('/', function(req,res){			//Serve index.html when connecting to the domain root
	res.sendfile('index.html');
});

app.use('/resources', express.static(__dirname + '/resources'));	//Imports all the files in this and all all subdirectories. 

server.listen(8080);

io = io.listen(server);

io.sockets.on('connection', function(socket){
	console.log('Connected');

	socket.on('getTweets', function(){
		fs.exists('tweets.json', function(exists){
			if(exists){
				console.log("File is being overwritten!");
				socket.emit("tweetOver");
				gatherTweets();
			}
			else{
				gatherTweets();
				socket.emit("tweetSuccess");
			}
		})
	});

	socket.on('getCsv', function(){
		tweet2csv();
	});

	socket.on('disconnect', function(){
		console.log('Disconnected');
	});
});

/**
 * Connect to the streaming twitter API via ntwitter module to collect 1000 tweets to write to a json file. 
 * @return file ITWS4200-zonej-tweets.json
 */
function gatherTweets() {
	console.log('Gettin dem dere tweets');
	var i = 0;
	var tweets = [];

	twit.stream('statuses/sample', function(stream) {
		stream.on('error', function(error, code){
			console.log("error: " + error + ": " + code);
		});

		stream.on('end', function(response){
			console.log("Stream Ended");
		});

		stream.on('destroy', function(response){
			console.log("Stream Destroyed");
		});
		
		stream.on('data', function(data){
			if(i < 1000){
				if(i % 20 == 0){
					console.log(i);
				}
				tweets.push(data);
				i++;
			}

			else if(i == 1000){
				i++;
				fs.writeFile('ITWS4200-zonej-tweets.json', JSON.stringify(tweets, null, 4), function(err){
					if(err) throw err;
					console.log("Tweets saved to file!");
				});
			}
				
			else{
				stream.destroy();
			}
		});
	});
}

/**
 * Take the json file that is created by the gatherTweets function and exports certain fields to a csv file with the same name. This function uses the json2csv module of node. 
 * @return ITWS4200-zonej-tweets.csv
 */
function tweet2csv() {
	console.log("Converting to CSV.");
	var data = fs.readFileSync('ITWS4200-zonej-tweets.json').toString();
	var json = JSON.parse(data);
	var columns = ['created_at', 'id', 'text', 'user.id', 'user.name', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 
		'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
		
	var col_names = ['created_at', 'id','text', 'user_id', 'user_name', 'user_screen_name', 'user_location', 'user_followers_count', 'user_friends_count', 
		'user_created_at', 'user_time_zone', 'user_profile_background_color', 'user_profile_image_url', 'geo', 'coordinates', 'place'];

	json2csv({data: json, fields: columns, fieldNames: col_names}, function(err, csv){
		if(err) console.log(err);
		fs.writeFile('ITWS-zonej-tweets.csv', csv, function(err){
			if(err) throw err;
			console.log('file saved');
		});
	});
}