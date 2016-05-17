(function() {
    var username = localStorage.getItem('username') || null;
    if (!username) {
        window.location.href = '/';
    }

    var socket = io();

    console.log('Welcome to our chat', username);

})();
