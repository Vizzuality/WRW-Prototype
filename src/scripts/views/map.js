define([
  'underscore',
  'backbone',
  'slick'
], function(_, Backbone, slick) {

  'use strict';

  var Map = Backbone.View.extend({

    initialize: function() {
      this.next = $('.right-control');
      this.scenarios = $('.scenarios > li');
      this.hideArrow = $('.hide-arrow');
      this.showArrow = $('.show-arrow');
      this.map = $('#map');

      _.bindAll(this, 'changeMap', 'hideSlide', 'showSlide', 'goMap');

      this.loadMap();

      this.scenarios.on('click', this.changeMap);

      this.hideArrow.on('click', this.hideSlide);
      this.showArrow.on('click', this.showSlide);

      this.next.on('click', this.goMap);
    },

    hideSlide: function() {
      var slide = $('.read-more-container');

      slide.attr('class', 'insights--slideshow-container read-more-container is-priority show slide-left');

      this.hideArrow.attr('class', 'hide-arrow is-hidden');
      this.showArrow.attr('class', 'show-arrow');
    },

    showSlide: function() {
      var slide = $('.read-more-container');

      slide.attr('class', 'insights--slideshow-container read-more-container is-priority show slide-right');

      this.showArrow.attr('class', 'show-arrow is-hidden');
      this.hideArrow.attr('class', 'hide-arrow');
    },

    loadMap: function(viz) {
      if (!viz) {
        viz = 'https://insights.cartodb.com/api/v2/viz/eda2596a-3ce7-11e5-aea1-0e0c41326911/viz.json';
        this.map.attr('class', 'hide-controls');
      } else {
        this.map.attr('class', '');
      }

      if (this.mapContainer && this.mapContainer.map.layers) {
        this.map.remove();

        var container = $('.insights-map-container');
        var newMap = document.createElement('div');

        newMap.setAttribute('id', 'map');
        container.insertBefore(newMap, null);

        this.mapContainer.mapView.invalidateSize(true);
      }

      this.mapContainer = cartodb.createVis('map', viz)
        .done(_.bind(function(vis, layers) {

          var center = L.latLng(0, 0);
          this.mapContainer.map.setView(center, 3, {animation: true});

          window.setTimeout(function() {
            layers[0].leafletMap.setMaxBounds([
              [180.0000, 90.0000],
              [-180.0000, -90.0000]
            ]);
        }, 500);

        var legend = $('.cartodb-legend-stack');
        var html = $(document.createElement('div'));
        html.attr('class', 'legend-options')
        html.innerHTML = '<a href="/explore.html">open in data map</a> <div class="options"> \
          <a href=""><svg class="icon icon-cog"><use xlink:href="#icon-cog"></use></svg></a> \
          <svg class="icon icon-share"><use xlink:href="#icon-share"></use></svg> \
          </div>';

        legend.insertBefore(html, legend.find('.cartodb-legend').next());
      }, this));
    },

    changeMap: function(e) {
      e && e.preventDefault();
      var scenario = e.currentTarget.getAttribute('data-scenario');
      var viz;

      e.currentTarget.attr('class', 'current');

      switch(scenario) {

        case 'A':
          viz = 'https://insights.cartodb.com/api/v2/viz/eda2596a-3ce7-11e5-aea1-0e0c41326911/viz.json';
          break;
        case 'B':
          viz = 'https://insights.cartodb.com/api/v2/viz/3d2060a4-3ce8-11e5-b991-0e853d047bba/viz.json';
          break;
        case 'C':
          viz = 'https://insights.cartodb.com/api/v2/viz/dbece2a8-3cec-11e5-8d9a-0e4fddd5de28/viz.json';
          break;
      }

      this.loadMap(viz);
    },

    goMap: function(e) {
      e && e.preventDefault();

      var exploreContainer = $('.explore-container');
      var veil = $('.veil');
      var navigation = $('.map-navigation');

      exploreContainer.attr('class', exploreContainer.attr('class') + ' slide-left');
      veil.attr('class', veil.attr('class') + ' hide');
      navigation.attr('class', navigation.attr('class') + ' show');


      window.setTimeout(_.bind(function() {
        this.map.attr('class', 'is-priority');
        this.hideSlide();
      }, this), 1500);

    }

  });

  return Map;

});
