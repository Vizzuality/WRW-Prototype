define([
  'backbone'
], function(Backbone) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      '(/)': 'homepage',
      'index.html': 'homepage',
      'login.html': 'login',
      'planet-pulse.html': 'planetPulse'
    }

  });

  return Router;

});
