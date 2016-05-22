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

var Users = [];

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
                //users: Users
        });
    });
});


// Sockets
io.on('connection', function(socket) {

    // Adding a new user
    socket.on('newUser', function(username) {

        var newUser = {
            id: uuid.v4(),
            username: username
        }

        socket.userData = newUser;
        io.emit('newUserId', newUser);
    });

    socket.on('existsUser', function(user) {
        socket.userData = user;

        var userExists = false;
        Users.forEach(function(u) {
            if (user.id == u.id) {
                userExists = true;
            }
        });

        if (!userExists) {
            Users.push(user);
        }

        console.log('online: ', Users);
        io.emit('usersOnline', Users);
    });

    socket.on('chatMessage', function(result) {

        console.log(socket.userData);

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

            console.log('New message added');
        });
        // emit to everyone
        io.emit('chatResult', result);
    });

    socket.on('clear', function(result) {
        Messages.remove({}, function(err) {
            if (err) console.log(err);

            io.emit('clearAll');
        });
    });

    socket.on('disconnect', function() {
        //Delete user disconnected user from online users list
        //Users.slice();
        if ('userData' in socket) {
            for (var i = 0; i < Users.length; i++) {
                console.log('Users for off', Users[i]);
                if (Users[i].username == socket.userData.username) {
                    Users.splice(i);
                    io.emit('usersOnline', Users);
                }
            }
        }

    });

});

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
