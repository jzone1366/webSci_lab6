var twitter = require('ntwitter');
var fs = require('fs');
var json2csv = require('json2csv');
var express = require('express');
var io = require('socket.io');
var http = require('http');
var app = express();
var server = http.createServer(app);
var twit = new twitter({
	consumer_key: '5UMbMiZmyfmZIv4w4wIvA',
	consumer_secret: '4XbLRKae0JnngpHyvgXm1K0dnmHYjKGwsZhHrfychy0',
	access_token_key: '110624472-7wxnUD6uIdDYnwLAEIucjtVe1jn6oMWgwd4Oytmp',
	access_token_secret: 'wfgF941yxA0xt2eg6QPUPpI2p5KBCJY3j9OOhir3gsFHF'
});

app.get('/', function(req,res){
	res.sendfile('index.html');
});

app.use('/resources', express.static(__dirname + '/resources'));

server.listen(8080);

io = io.listen(server);
io.sockets.on('connection', function(socket){
	console.log('Connected');

	socket.on('getTweets', function(){
		console.log('Gettin dem dere tweets');
		var i = 0;
		var tweets = [];

		twit.stream('statuses/sample', function(stream) {
			stream.on('error', function(error, code){
				console.log("error: " + error + ": " + code);
			});
			stream.on('end', function(response){
				console.log("Stream Ended");
				console.log(response);
			});
			stream.on('destroy', function(response){
				console.log("Stream Destroyed");
				console.log(response);
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
					fs.writeFile('tweets.json', JSON.stringify(tweets, null, 4), function(err){
						if(err) throw err;
						console.log("Tweets saved to file!");
						i++;
					});
				}
				else{
					console.log("Stream Destroyed");
					setTimeout(stream.destroy, 10);
				}
			});
		});
	});

	socket.on('event2', function(){
		console.log("Converting to CSV.");
		var data = fs.readFileSync('tweets.json').toString();
		var json = JSON.parse(data);
		var columns = ["created_at", "id", "id_str", "text", "source", "truncated", 
		"in_reply_to_status_id", "in_reply_to_status_id_str", "in_reply_to_user_id", 
		"in_reply_to_user_id_str", "in_reply_to_screen_name", "user", "geo", 
		"coordinates", "place", "contributors", "retweeted_status", "retweet_count", 
		"favorite_count", "entities", "favorited", "retweeted", "filter_level", "lang"];

		json2csv({data: json, fields: columns}, function(err, csv){
			if(err) console.log(err);
			fs.writeFile('tweets.csv', csv, function(err){
				if(err) throw err;
				console.log('file saved');
			});
		});
	});

	socket.on('disconnect', function(){
		console.log('Disconnected');
	});
});