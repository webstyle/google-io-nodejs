var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Static files
app.use(express.static('bower_components'));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/public/main.html');
});

// Sockets
io.on('connection', function(socket) {

    socket.on('chatMessage', function(result) {
        console.log('=================================');
        console.log('NEW MESSAGE!!');
        console.log(result.username + ': ' + result.message);
        console.log('=================================');
        io.emit('chatResult', result);
    });

    socket.on('setTyping', function(result) {
      io.emit('typing', result);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

});

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
