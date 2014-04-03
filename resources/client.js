jQuery(document).ready(function() {
	var socket = io.connect();

	socket.on('connect', function(){
		console.log('Connected');
	});
	socket.on('disconnect', function(){
		console.log('Disconnected');
	});
	socket.on('error', function(err){
		if(err == 'handshake error') {
			console.log('handshake error', err);
		} else {
			console.log('io error', err);
		}
	});

	socket.on('tweetSuccess', function(){
		$("#alert").html("<div class='alert alert-success alert-dismissable'>Getting Dem Dere Tweets!</div>");
	});

	socket.on('tweetOver', function(){
		$("#alert").html("<div class='alert alert-warning alert-dismissable'>File is being overwritten!</div>");
	})

	socket.on('csvSuccess', function(){
		$("#alert").html("<div class='alert alert-success alert-dismissable'>Exporting JSON to CSV!</div>");
	});

	socket.on('csvOver', function(){
		$("#alert").html("<div class='alert alert-warning'>File is Being overwritten!</div>");
	})

	$("#btn1").click(function() {
		socket.emit('getTweets');
	});

	$("#btn2").click(function() {
		socket.emit('getCsv');
	});
});