require.config({

  baseUrl: 'js/dashboard',

  paths: {
    jquery:     '../vendor/jquery/dist/jquery.min',
    underscore: '../vendor/underscore/underscore-min',
    backbone:   '../vendor/backbone/backbone-min',
    handlebars: '../vendor/handlebars/handlebars.amd.min',
    d3:         '../vendor/d3/d3',
    d3chart:    'helpers/chart',
    moment:     '../vendor/moment/min/moment.min',
    text:       '../vendor/text/text',
    'backbone-super': '../vendor/backbone-super/backbone-super/' +
      'backbone-super-min',
    slick:      '../vendor/slick-carousel/slick/slick.min'
  },

  shim: {
    d3:   { exports: 'd3' }
  }

});

require([
  'underscore',
  'backbone'
], function(_, Backbone) {

  'use strict';

  var GlobeView = Backbone.View.extend({

    el: '#globe',

    initialize: function() {
      this.createGlobe();
    },

    createGlobe: function() {
      this.globe = new Globe(this.el);
    }

  });

  var Router = Backbone.Router.extend({

    routes: {
      '': 'reset',
      ':section/:vis': 'vis'
    }

  });

  var App = Backbone.View.extend({

    el: document.body,

    initialize: function() {
      this.$title = $('.planet-pulse--title');
      this.$nav = $('.planet-pulse--main-nav')
      this.$backBtn = $('#backBtn');

      this.globeView = new GlobeView();
      this.router = new Router();

      this.setListeners();
    },

    setListeners: function() {
      var self = this;
      var fullscreenEvents = 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange';

      this.listenTo(this.router, 'route:reset', this.reset);
      this.listenTo(this.router, 'route:vis', this.initVis);

      // On fullscreen
      fullscreenEvents.split(' ').forEach(function(e) {
        document.addEventListener(e, function() {
          self.globeView.globe.resize();
        });
      });
    },

    reset: function() {
      this.$title.show(100);
      this.$nav.removeClass('is-blur');
      this.$backBtn.hide(100);
      this.globeView.globe.setPosition(0, -0.1);
    },

    initVis: function(section, vis) {
      this.$title.hide(100)
      this.$nav.addClass('is-blur');
      this.$backBtn.show(100);
      
      // TODO
      // this.globeView.globe.removeClouds();
      this.globeView.globe.removeLayer(this.currentVis);
      this.currentVis = vis;
      // this.globeView.globe.createLayer(this.currentVis, '/img/globe-layers/rainfall.jpg');
      this.globeView.globe.setPosition(0.35, -0.1);
    },

    start: function() {
      Backbone.history.start({ pushState: false });
    }

  });

  new App().start();

});
