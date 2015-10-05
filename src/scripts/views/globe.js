define([
  'underscore',
  'backbone',
  'lib/globe',
  'views/fullscreen'
], function(_, Backbone, Globe, fullscreen) {

  'use strict';

  var hostname = '/';

  var GlobeView = Backbone.View.extend({

    initialize: function() {
      this.$title = $('.planet-pulse--title');
      this.$nav = $('.planet-pulse--main-nav');
      this.$articles = $('#planetPulseContent').find('article');
      this.$backBtn = $('#backBtn');
      this.$legend = $('.planet-pulse--legend');
      this.fullscreenCount = 0;
      this.$planetPulse = $('.planet-pulse');

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
        conflicts: document.getElementById('layer6').src,
        grace: document.getElementById('layer7').src,
        epidemic: document.getElementById('layer9').src,
        protests: document.getElementById('layer8').src,
        forma: document.getElementById('layer10').src
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
          _this.fullscreenWatcher();
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

    fullscreenWatcher: function() {
      var isEnteringFullscreen = this.fullscreenCount % 2 === 0;
      this.fullscreenCount++;

      if(isEnteringFullscreen && !fullscreen.isFullscreen()) {
        this.$planetPulse.addClass('is-fullscreen');
      } else if(!isEnteringFullscreen && fullscreen.isFullscreen()) {
        this.$planetPulse.removeClass('is-fullscreen');
      }
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
      var isSpaceRemoved = false;
      var isLightRemoved = true;

      this.$title.hide(100)
      this.$nav.addClass('is-blur');
      this.$backBtn.show(100);

      this.globe.removeClouds();
      this.globe.removeLayer(this.currentVis);
      this.currentVis = vis;
      this.resetLegend();
      this.resetLayersList();

      this.$el.removeClass('is-grace');

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
        case 'grace':
          isSpaceRemoved = true;
          this.$el.addClass('is-grace');
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.grace);
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
        case 'forma':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.forma);
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
        case 'epidemic':
          this.globe.ambientLight.color.setHex(0xcccccc);
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.epidemic);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        case 'protests':
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.dark);
          this.globe.createLayer(this.currentVis, this.layers.protests);
          this.setLegend(vis);
          this.updateLayersList();
          break;
        default:
          isLightRemoved = false;
          this.globe.sphere.material.map = THREE.ImageUtils.loadTexture(this.basemaps.satellite);
          this.globe.ambientLight.color.setHex(0x444444);
          this.globe.addClouds();
      }

      if (isLightRemoved) {
        this.globe.ambientLight.color.setHex(0xffffff);
        this.globe.scene.remove(this.globe.light);
      }

      this.isLightRemoved = isLightRemoved;

      if (isSpaceRemoved) {
        this.globe.scene.remove(this.globe.space);
      } else {
        this.globe.scene.add(this.globe.space);
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
      var $link = this.$legend.find('a');
      switch(vis) {
        case 'fires':
          $title.text('Fires');
          $title.addClass('color-fires');
          $link.attr('href', 'explore-detail.html#11');
          break;
        case 'protected-areas':
          $title.text('Protected areas');
          $title.addClass('color-protected-areas');
          $link.attr('href', 'explore-detail.html#10');
          break;
        case 'umd':
          $title.text('UMD');
          $title.addClass('color-umd');
          $link.attr('href', 'explore-detail.html#9');
          break;
        case 'forma':
          $title.text('Forma');
          $title.addClass('color-forma');
          $link.attr('href', 'explore-detail.html#10');
          break;
        case 'temperature':
          $title.text('Temperature');
          $title.addClass('color-temperature');
          $link.attr('href', 'explore-detail.html#13');
          break;
        case 'grace':
          $title.text('Groundwater depletion (GRACE)');
          $title.addClass('color-grace');
          $link.attr('href', 'explore-detail.html#12');
          break;
        case 'population':
          $title.text('Population data');
          $title.addClass('color-population');
          $link.attr('href', 'explore-detail.html#14');
          break;
        case 'conflicts':
          $title.text('Conflicts events');
          $title.addClass('color-conflicts');
          $link.attr('href', 'explore-detail.html#17');
          break;
        case 'protests':
          $title.text('Protests');
          $title.addClass('color-protests');
          $link.attr('href', 'explore-detail.html#16');
          break;
        case 'epidemic':
          $title.text('Epidemics');
          $title.addClass('color-epidemic');
          $link.attr('href', 'explore-detail.html#15');
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

      if (this.isLightRemoved) {
        this.globe.scene.add(this.globe.light);
      }
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
