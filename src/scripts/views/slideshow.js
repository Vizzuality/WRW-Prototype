define([
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
      this.$el.slick({
        arrows: false,
        draggable: false,
        infinite: true,
        fade: true,
        adaptiveHeight: false,
      });

      this.updateHeight(0);

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
      this.updateHeight(nextSlide);
      if(!!navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS/i) ||
        window.innerWidth <= 540) {
        $('html, body').animate({
          scrollTop: $('.insights--slideshow-container').offset().top
        }, 300);
      }
    },

    updateHeight: function(index) {
      var h = $("[data-slick-index='" +index+ "']").height();
      this.$el.css({
        height: h
      })
    }

  });

  return Slideshow;

});
