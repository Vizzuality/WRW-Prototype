define([
  'backbone',
  'helpers/auth'
], function(Backbone, auth) {

  'use strict';

  var PASSWORD = 'password123';

  var LoginPage = Backbone.View.extend({

    events: {
      'submit form': 'onSubmit'
    },

    onSubmit: function(e) {
      e.preventDefault();
      var passwordEl = document.getElementById('password');
      if (passwordEl.value === PASSWORD) {
        auth.setLogin();
        window.location.href = 'index.html';
      }
      return false;
    }

  });

  return LoginPage;

});
