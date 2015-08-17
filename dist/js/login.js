(function() {

var COOKIE_NAME = 'wrw_logged_in';
var loggedIn = function() {
  var cookieMatch = document.cookie.match(new RegExp(COOKIE_NAME+'=([^;]+)'));
  return cookieMatch;
}

var toggleContentElements = function(contentElState, loginElState) {
  document.addEventListener("DOMContentLoaded", function() {
    var contentEl = document.querySelector('.js--main-content'),
        loginEl   = document.querySelector('.js--main-login');

    contentEl.style.display = contentElState;
    loginEl.style.display = loginElState;
  });
};

if (loggedIn()) {
  toggleContentElements("block", "none");
} else {
  toggleContentElements("none", "block");
}

})();
