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
      'partners.html': 'partners',
      'partners-wwf.html': 'partnersWwf',
      'insights-slideshow.html': 'slideshow',
      'insights-map.html': 'map',
      'explore.html': 'explore',
      'explore-detail.html': 'exploreDetail'
      '*path': 'default'
    }

  });

  return Router;

});
