$(document).ready(function() {

  // Join to chat with username
  $('#join').click(function() {
    localStorage.clear();
    localStorage.setItem('username', $('#username').val());
    window.location.href = '/chat';
  });

});
