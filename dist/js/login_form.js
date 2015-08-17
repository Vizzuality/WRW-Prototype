(function() {

var COOKIE_NAME = 'wrw_logged_in',
    PASSWORD = 'password123';

var logIn = function() {
  document.cookie = COOKIE_NAME + "=true";
};

var onLogin = function(event) {
  event.preventDefault();

  var passwordEl = document.getElementById('password');
  if (passwordEl.value === PASSWORD) { logIn(); }

  location.reload();
};

var formEl = document.getElementById('login');
formEl.addEventListener("submit", onLogin, false);

})();
