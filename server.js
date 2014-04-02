var fs = require('fs');
var json2csv = require('json2csv');
var express = require('express');
var io = require('socket.io');
var http = require('http');
var app = express();
var server = http.createServer(app);
var twitter = require('ntwitter');
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
		fs.exists('tweets.json', function(exists){
			if(exists){
				console.log("FILE EXISTS");
			}
			else{
				console.log("FILE DOES NOT EXIST");
			}
		})
	});

	socket.on('event2', function(){
		console.log("Converting to CSV.");
		var data = fs.readFileSync('tweets.json').toString();
		var json = JSON.parse(data);
		var columns = ['created_at', 'id', 'text', 'user.id', 'user.name', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
		var col_names = ['created_at', 'id','text', 'user_id', 'user_name', 'user_screen_name', 'user_location', 'user_followers_count', 'user_friends_count', 'user_created_at', 'user_time_zone', 'user_profile_background_color', 'user_profile_image_url', 'geo', 'coordinates', 'place'];

		json2csv({data: json, fields: columns, fieldNames: col_names}, function(err, csv){
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
					fs.writeFile('tweets.json', JSON.stringify(tweets, null, 4), function(err){
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