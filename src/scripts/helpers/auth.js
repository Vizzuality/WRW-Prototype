define(['lib/class'], function(Class) {

  var COOKIE_NAME = 'wrw_logged_in';

  var AuthHelper = Class.extend({

    checkLogin: function() {
      var regex = new RegExp(COOKIE_NAME+'=([^;]+)');
      var cookieMatch = document.cookie.match(regex);
      return !!cookieMatch;
    },

    setLogin: function() {
      document.cookie = COOKIE_NAME + '=true';
    }

  });

  return new AuthHelper();

});
