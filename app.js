// Libs
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var path = require('path');
var uuid = require('node-uuid');

// Models
var Messages = require('./models/messages');

//mongodb connection
mongoose.connect('mongodb://localhost:27017/test');

// Static files
app.use(express.static('bower_components'));
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.render('login');
});

app.get('/chat', function(req, res) {
    Messages.find(function(err, results) {
        if (err) throw err;

        res.render('main', {
            messages: results
        });
    });
});

// Sockets
io.on('connection', function(socket) {

    socket.on('chatMessage', function(result) {

        console.log('=================================');
        console.log('NEW MESSAGE!!');
        console.log(result.username + ': ' + result.message);
        console.log('=================================');

        // save message to database
        var body = {
            id: uuid.v4(),
            username: result.username,
            text: result.message,
            created_at: new Date()
        }
        var message = new Messages(body);
        message.save(function(err) {
            if (err) throw err;

            // emit to everyone
            io.emit('chatResult', result);
            console.log('New message added');
        });
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
