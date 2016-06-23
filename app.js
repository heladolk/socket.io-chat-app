'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('./public'));

app.get('/', (req, res, next) => {
	res.render('index');
});

io.on('connection', (socket) => {

	socket.on('client-message-send', (message) => {
		io.emit('server-message-send', message);
	});

	socket.on('disconnect', () => {
		console.log(`Client has disconnected...`);
	});

	socket.on('client-typing', (statusObj) => {
		socket.broadcast.emit('server-update-view', statusObj);
	});

	socket.on('client-stop-typing', (statusObj) => {
		socket.broadcast.emit('server-update-view', statusObj);
	});
});

server.listen(8000, () => { console.log(`Chat app running on port 8000`); });


