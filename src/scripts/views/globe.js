define([
  'underscore',
  'backbone',
  'lib/globe'
], function(_, Backbone, Globe) {

  'use strict';

  var hostname = '/';

  var GlobeView = Backbone.View.extend({

    initialize: function() {
      this.$title = $('.planet-pulse--title');
      this.$nav = $('.planet-pulse--main-nav');
      this.$articles = $('#planetPulseContent').find('article');
      this.$backBtn = $('#backBtn');
      this.$legend = $('.planet-pulse--legend');

      this.basemaps = {
        satellite: document.getElementById('basemap1').src,
        dark: document.getElementById('basemap2').src
      };

      this.layers = {
        fires: document.getElementById('layer1').src,
        protectedAreas: document.getElementById('layer2').src,
        umd: document.getElementById('layer3').src,
        temperature: document.getElementById('layer4').src,
        population: document.getElementById('layer5').src,
        conflicts: document.getElementById('layer6').src
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
          _this.globe.camera.setViewOffset( w, h, w * -0.17, h * 0, w, h );
        } else {
          _this.globe.camera.setViewOffset( w, h, 0, 0, w, h );
        }
      }, 30));
    },

    checkHash: function() {
      var hash = window.location.hash.split('/');
      if (hash.length && hash[0] && hash[1]) {
        this.setContent(hash[0].substring(1));
        this.setVis(hash[1]);
      } else if (hash.length && hash[0] && !hash[1]) {
        this.setContent(hash[0].substring(1));
        this.setVis(null);
      } else {
        this.setContent(null);
        this.reset();
      }
    },

    setContent: function(section) {
      this.$nav.find('a').removeClass('is-active');
      this.$articles.removeClass('is-active');
      if (section) {
        $('#' + section + 'Link').addClass('is-active');
        $('#' + section + 'Content').addClass('is-active');
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
      this.resetLegend();
      this.resetLayersList();

      switch(vis) {
        case 'population':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.population);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        case 'temperature':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.temperature);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        case 'conflicts':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.conflicts);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        case 'fires':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.fires);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        case 'protected-areas':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.protectedAreas);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        case 'umd':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.umd);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        default:
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.satellite);
          this.globe.ambientLight.color.setHex(0x444444);
          this.globe.addClouds();
      }

      this.globe.camera.setViewOffset( w, h, w * -0.17, h * 0, w, h );
    },

    resetLegend: function() {
      this.$legend.addClass('is-hidden');
      this.$legend.find('h3').removeClass();
    },

    setLegend: function(vis) {
      this.$legend.removeClass('is-hidden');
      var $title = this.$legend.find('h3');
      switch(vis) {
        case 'fires':
          $title.text('Fires');
          $title.addClass('color-fires');
          break;
        case 'protected-areas':
          $title.text('Protected areas');
          $title.addClass('color-protected-areas');
          break;
        case 'umd':
          $title.text('UMD');
          $title.addClass('color-umd');
          break;
      }
    },

    resetLayersList: function() {
      $('article a.is-active').removeClass('is-active');
    },

    updateLayersList: function() {
      $('article a[href="'+window.location.hash+'"]').addClass('is-active');
    },

    reset: function() {
      var w = this.globe.element.clientWidth;
      var h = this.globe.element.clientHeight;

      this.$title.show(100);
      this.$nav.removeClass('is-blur');
      this.$backBtn.hide(100);
      this.resetLegend();

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
