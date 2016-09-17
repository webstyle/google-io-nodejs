(function() {
    var username = localStorage.getItem('username') || null;
    var id = localStorage.getItem('id');
    var onlineUsers = [];
    if (!username) {
        window.location.href = '/';
    }

    var socket = io();

    console.log('Welcome to our chat', username);

    // heart beating
    socket.emit('existsUser', {
        username: username,
        id: id
    });

    socket.on('usersOnline', function(users) {

        $('#users').html('');

        users.forEach(function(user) {
            $('#users').append("<button type='button' id='" + user.id + "' class='list-group-item'><i class='fa fa-user'></i> " + user.username + "</button>");
        });

    });

    socket.on('onlineUser', function(user) {
        $('#users').append("<button type='button' id='" + user.id + "' class='list-group-item'>" + user.username + "</button>");
    });

    // Submit form and emit chat message
    $('form').submit(function() {
        var post = {
            username: username,
            message: $('#form').val(),
            created_at: new Date()
        };
        if (post.message) {
            socket.emit('chatMessage', post);
            $('#form').val('');
            $('.emoji-wysiwyg-editor').empty();
            scrollBottom();
        }
        return false;
    });

    // typing
    $('form').on('input', function() {
        socket.emit('setTyping', username);
    });

    socket.on('typing', function(name) {
        $('#typing').append("<p class='text-info'>" + name + " is typing...</p>");
    });

    // chat results
    socket.on('chatResult', function(msg) {
        console.log(msg);
        scrollBottom();
        $("#messages").append("<div class='media'><div class='media-left'><img class='media-object' src='/images/person.png' alt='' height='40'></div><div class='media-body'><h4 class='media-heading'>" + msg.username + "</h4><p>" + msg.message + "</p</div></div><hr />");
    });

    //clear
    $('#clear').click(function() {
        socket.emit('clear');
    });

    // on clear
    socket.on('clearAll', function() {
        $('#messages').html('');
    });

    // logout
    $('.logout').click(function() {
        localStorage.clear();
    });

    scrollBottom();

    function scrollBottom() {
        $("html, body").animate({
            scrollTop: $(document).height()
        }, "slow");
    }

})();


$(function() {
    // Initializes and creates emoji set from sprite sheet
    window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: '/lib/img/',
        popupButtonClasses: 'fa fa-smile-o'
    });
    // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
    window.emojiPicker.discover();
});
