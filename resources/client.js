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

	$("#btn1").click(function() {
		socket.emit('getTweets');
		$(".tweet_err").text('Getting Those Tweets!');
	});

	$("#btn2").click(function() {
		socket.emit('event2');
		$(".csv_err").text('Exporting JSON to CSV!');
	});
});