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

    el: '.insights--slideshow-container',

    events: {
      'click .left-control': 'prevSlide',
      'click .right-control': 'nextSlide'
    },

    initialize: function() {
      $(document).ready(_.bind(function() {

        this.$el.slick({
          arrows: false,
          draggable: false,
          infinite: false,
          fade: true,
          adaptiveHeight: true
        });

      }, this));

      this.$asideWideContainer = $('.insights--slideshow-wide-aside');

      this.setListeners();
    },

    setListeners: function() {
      this.$el.on('beforeChange', _.bind(this.update, this));
    },

    prevSlide: function(e) {
      e.preventDefault();
      this.$el.slick('slickPrev');
    },

    nextSlide: function(e) {
      e.preventDefault();
      this.$el.slick('slickNext');
    },

    update: function(e, slick, currentSlide, nextSlide ) {
      if(!!navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS/i) ||
        window.innerWidth <= 540) {
        $('html, body').animate({
          scrollTop: $('.insights--slideshow-container').offset().top
        }, 300);
      }
    }

  });

  new Slideshow();

});
