(function() {
    var username = localStorage.getItem('username') || null;
    if (!username) {
        window.location.href = '/';
    }

    var socket = io();

    console.log('Welcome to our chat', username);

    $('form').submit(function() {
        var post = {
            username: username,
            message: $('#form').val()
        };
        if (post.message) {
            socket.emit('chatMessage', post);
            $('#form').val('');
        }
        return false;
    });

    // typing
    $('form').on('input', function() {
        socket.emit('setTyping', username);
    });

    socket.on('typing', function(name) {
      $('#typing').append("<p class='text-info'>"+name+" is typing...</p>");
    });

    socket.on('chatResult', function(msg) {
        console.log(msg);
        $("html, body").animate({
            scrollTop: $(document).height()
        }, "slow");
        $("ul").append("<div class='media'><div class='media-left'><img class='media-object' src='/images/person.png' alt='' height='40'></div><div class='media-body'><h4 class='media-heading'>" + msg.username + "</h4><p>" + msg.message + "</p</div></div><hr />");
    });

})();
