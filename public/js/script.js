$(function() {
	var socket = io();
	var status = $('#status');
	var messageContainer = $('#message-container');
	var messageForm = $('#message-form');
	var messageInput = $('#message-input');
	var typingStatus = $('#typing-status');

	socket.on('connect', function() {
		status.text('Connected');
	});

	socket.on('disconnect', function() {
		status.text('Disconnected');
	});

	messageForm.on('submit', function(event) {
		event.preventDefault();

		var message = messageInput.val();
		socket.emit('client-message-send', message);

		messageInput.val('');
		messageInput.blur();
	});

	socket.on('server-message-send', function(message) {
		var p = $('<p>');
		p.addClass('message');
		p.text(message);

		messageContainer.append(p);
	});

	messageInput.focusin(function() {
		var statusObj = { status: 'typing', message: 'someone is typing'};
		socket.emit('client-typing', statusObj);
	});

	messageInput.focusout(function() {
		var statusObj = { status: 'stop typing', message: 'someone stopped typing'};
		socket.emit('client-stop-typing', statusObj);
	});

	socket.on('server-update-view', function(statusObj) {
		if (statusObj.status === 'typing') {
			typingStatus.text(statusObj.message);
		} else if (statusObj.status === 'stop typing') {
			typingStatus.text('');
		}
	});

	socket.on('server-connection-established', function(message) {
		var p = $('<p>');
		p.addClass('message');
		p.text(message);

		messageContainer.append(p);
	});

	socket.on('server-disconnection', function(message) {
		var p = $('<p>');
		p.addClass('message');
		p.text(message);

		messageContainer.append(p);
	});

});

