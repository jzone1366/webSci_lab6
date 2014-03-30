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
	});

	$("#btn2").click(function() {
		socket.emit('event2');
	});
});