var socket = io();

$(document).ready(function() {
    // Join to chat with username
    $('#join').click(function() {
        var username = $('#username').val();

        localStorage.clear();

        localStorage.setItem('username', username);
        window.location.href = '/chat';

        socket.emit('newUser', username);
        socket.on('newUserId', function(user) {
            localStorage.setItem('id', user.id);
        });

    });
});
