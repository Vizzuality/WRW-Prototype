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
      'partners-vizzuality.html': 'partnersVizzuality',
      'partners-wri.html': 'partnersWri',
      'partners.html': 'partners',
      'insights-slideshow.html': 'slideshow',
      'insights-map.html': 'map',
      'insights-interactive-edi.html': 'interactiveEdi',
      'insights-slideshow-peru.html': 'slideshowPeru',
      'insights-interactive-map.html': 'interactiveMap',
      'explore.html': 'explore',
      'explore-detail.html': 'exploreDetail',
      'explore-standalone.html': 'exploreStandalone',
      'app-deforestation.html': 'appDeforestation',
      'app-skydipper.html': 'appSkydipper',
      '*path': 'default'
    }

  });

  return Router;

});
