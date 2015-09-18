define([
  'backbone'
], function(Backbone) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      '(/)': 'homepage',
      'index.html': 'homepage',
      'login.html': 'login',
      'planet-pulse.html': 'planetPulse',
      'dashboard.html': 'countries',
      'partners-gp.html': 'partnersGp',
      'partners-wwf.html': 'partnersWwf',
      'insights-slideshow.html': 'slideshow',
      'insights-map.html': 'map',
      'explore.html': 'explore',
      'explore-standalone.html': 'exploreStandalone',
      '*path': 'default'
    }

  });

  return Router;

});
