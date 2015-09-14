define(['underscore', 'backbone', 'lib/globe'], function(_, Backbone, Globe) {

  'use strict';

  var hostname = '/';

  var GlobeView = Backbone.View.extend({

    initialize: function() {
      this.$title = $('.planet-pulse--title');
      this.$nav = $('.planet-pulse--main-nav')
      this.$backBtn = $('#backBtn');

      this.basemaps = {
        satellite: document.getElementById('basemap1').src,
        dark: document.getElementById('basemap2').src
      };

      this.layers = {
        fires: document.getElementById('layer1').src,
        protectedAreas: document.getElementById('layer2').src,
        umd: document.getElementById('layer3').src
      };

      this.createGlobe();
    },

    createGlobe: function() {
      var _this = this;
      var fullscreenEvents = 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange';

      this.globe = new Globe(this.el.id);

      // On fullscreen
      fullscreenEvents.split(' ').forEach(function(e) {
        document.addEventListener(e, function() {
          _this.globe.resize();
        });
      });

      $(window).on('resize', _.debounce(function() {
        var w = _this.globe.element.clientWidth;
        var h = _this.globe.element.clientHeight;
        if (_this.currentVis) {
          _this.globe.camera.setViewOffset( w, h, w * -0.2, h * 0, w, h );
        } else {
          _this.globe.camera.setViewOffset( w, h, 0, 0, w, h );
        }
      }, 30));
    },

    checkHash: function() {
      var hash = window.location.hash.split('/');
      if (hash && hash[1]) {
        this.setVis(hash[1]);
      } else {
        this.reset();
      }
    },

    setVis: function(vis) {
      var w = this.globe.element.clientWidth;
      var h = this.globe.element.clientHeight;

      this.$title.hide(100)
      this.$nav.addClass('is-blur');
      this.$backBtn.show(100);

      this.globe.removeClouds();
      this.globe.removeLayer(this.currentVis);
      this.currentVis = vis;

      switch(vis) {
        case 'fires':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.fires);
          break;
        case 'protected-areas':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.protectedAreas);
          break;
        case 'umd':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.umd);
          break;
      }

      this.globe.camera.setViewOffset( w, h, w * -0.2, h * 0, w, h );
    },

    reset: function() {
      var w = this.globe.element.clientWidth;
      var h = this.globe.element.clientHeight;

      this.$title.show(100);
      this.$nav.removeClass('is-blur');
      this.$backBtn.hide(100);

      this.globe.removeLayer(this.currentVis);
      this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.satellite);
      this.globe.ambientLight.color.setHex(0x444444);
      this.globe.camera.setViewOffset( w, h, w * 0, h * 0, w, h );
      this.globe.addClouds();

      this.currentVis = null;
    }

  });

  return GlobeView;

});