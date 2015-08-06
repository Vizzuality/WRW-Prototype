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
  'backbone',
  'slick'
], function(_, Backbone, slick) {

  'use strict';

  var Slideshow = Backbone.View.extend({

    el: '.planet-pulse--slideshow-content',

    initialize: function() {;
      $(document).ready(_.bind(function() {

        this.$el.slick({
          arrows: false,
          draggable: false,
          infinite: false,
          fade: true
        });

      }, this));

      this.$backgroundContainer = $('.planet-pulse--slideshow-container');
      this.$asideContainer = $('.planet-pulse--slideshow-aside');
      this.$asideWideContainer = $('.planet-pulse--slideshow-wide-aside');

      this.setListeners();
    },

    setListeners: function() {
      $('.planet-pulse--tabs li').on('click', _.bind(this.nextSlide, this));
    },

    nextSlide: function(e) {
      e.preventDefault();

      var $tab = $(e.currentTarget);
      var position = $tab.parent().find('li').index($tab) + 1;

      $('.planet-pulse--tabs .active').removeClass('active');
      $tab.addClass('active');

      this.$el.slick('slickGoTo', position);

      this.updateMap(position);
    },

    updateMap: function(index) {
      /*
        Index: the tab position [[1, 4]]

        this.$backgroundContainer: change tha background image
        this.$asideContainer: useless here (content on the right)
        this.$asideWideContainer: container for the map
      */
    }

  });

  new Slideshow();

});
