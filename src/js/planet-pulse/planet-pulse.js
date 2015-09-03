require.config({

  baseUrl: 'js/dashboard',

  paths: {
    jquery:     '../vendor/jquery/dist/jquery.min',
    underscore: '../vendor/underscore/underscore-min',
    backbone:   '../vendor/backbone/backbone-min'
  }

});

require([
  'underscore',
  'backbone'
], function(_, Backbone) {

  'use strict';

  var hostname = location.hostname === 'localhost' || location.hostname === '192.168.1.142' ? '' : '/WRW-Prototype/dist/';

  var GlobeView = Backbone.View.extend({

    el: '#globe',

    initialize: function() {
      this.createGlobe();
    },

    createGlobe: function() {
      this.globe = new Globe(this.el);
    },

    setVis: function(vis) {
      var w = this.globe.w;
      var h = this.globe.h;

      this.globe.removeClouds();
      this.globe.removeLayer(this.currentVis);
      this.currentVis = vis;

      switch(vis) {
        case 'fires':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(hostname + 'img/planet-pulse/basemap-dark_4k.jpg');
          this.globe.createLayer(this.currentVis, hostname + 'img/planet-pulse/layers/fires_4k.png');
          break;
        case 'protected-areas':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(hostname + 'img/planet-pulse/basemap-terrain-blue_4k.jpg');
          this.globe.createLayer(this.currentVis, hostname + 'img/planet-pulse/layers/protected-areas_4k.png');
          break;
        case 'umd':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(hostname + 'img/planet-pulse/basemap-terrain-blue_4k.jpg');
          this.globe.createLayer(this.currentVis, hostname + 'img/planet-pulse/layers/umd_4k.png');
          break;
      }

      this.globe.camera.setViewOffset( w, h, w * -0.2, h * 0, w, h );
    },

    reset: function() {
      var w = this.globe.w;
      var h = this.globe.h;

      this.globe.removeLayer(this.currentVis);
      this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(hostname + 'img/planet-pulse/2_no_clouds_4k.jpg');
      this.globe.ambientLight.color.setHex(0x444444);
      this.globe.camera.setViewOffset( w, h, w * 0, h * 0, w, h );
      this.globe.addClouds();
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

      $('.img-preload').each(function(index, el) {
        el.src = hostname + el.src;
      });

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
      this.globeView.reset();
    },

    initVis: function(section, vis) {
      this.$title.hide(100)
      this.$nav.addClass('is-blur');
      this.$backBtn.show(100);

      // TODO
      this.globeView.setVis(vis);
    },

    start: function() {
      Backbone.history.start({ pushState: false });
    }

  });

  new App().start();

});
