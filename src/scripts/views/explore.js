define([
  'underscore',
  'backbone',
  'handlebars'
], function(_, Backbone, Handlebars) {

  'use strict';

  var mobileMenuTemplate = Handlebars.compile('<div class="sub-header-container is-desktop-hidden">' +
      '<label for="js--show--map"></label>' +
      '<input type="checkbox" id="js--show--map" class="is-hidden">' +
      '<div class="js--show--map align-right">' +
      '  GO TO THE MAP ›' +
      '</div>' +
      '<div class="js--hide--map is-hidden">' +
      '  ‹ EXPLORE DATA' +
      '</div>' +
    '</div>');

  var ExploreView = Backbone.View.extend({

    initialize: function(options) {
      this.hideLegend = options && options.hideLegend;

      this.map = L.map('map', {zoomControl: false}).setView([0,-30], 3);
      this.mapVisualisations = [
        {name: "Global Water Risk", url: "https://insights.cartodb.com/api/v2/viz/bf63525c-3cdd-11e5-afd4-0e4fddd5de28/viz.json"},
        {name: "Energy Plants", url: "https://insights.cartodb.com/api/v2/viz/c572a394-3cda-11e5-9e01-0e4fddd5de28/viz.json"},
        {name: "Country Flood Risk", url: "https://insights.cartodb.com/api/v2/viz/7676a37a-3ce0-11e5-a016-0e0c41326911/viz.json"}
      ];
      this.selectedVisualisations = _.map(_.range(this.mapVisualisations.length), function() { return null; });
      this.cachedLayers = JSON.parse(sessionStorage.getItem('layers') || '[]');

      new L.Control.Zoom({ position: 'topright' }).addTo(this.map);
      L.tileLayer('http://{s}.tiles.mapbox.com/v4/smbtc.7d2e3bf9/{z}/{x}/{y}@2x.png?access_token={access_token}', {
        access_token: 'pk.eyJ1Ijoic21idGMiLCJhIjoiVXM4REppNCJ9.pjaLujYj-fcCPv5evG_0uA'
      }).addTo(this.map);

      _.bindAll(this, 'mapExpandButton');

      this.setListeners();

      if(this.cachedLayers.length) {
        this.cachedLayers.forEach(_.bind(function(o) {
          var id = o.id,
              isVisible = o.visible;
          var $el = $('.add-to-map[data-id='+id+']');
          var callback = null;
          if(!isVisible) {
            var callback = function(id) {
              var $switch = $('.onoffswitch[data-id='+id+']');
              this.toggleLayer(id, $switch);
            };
          }

          this.addLayerToMap(id, $el, !!callback ? _.bind(callback, this) : null);
        }, this));
      }

      /* For mobile devices */

      $('.header').append(mobileMenuTemplate());

      var checkbox = document.querySelector('#js--show--map');
      var showMapClass = '.js--show--map';
      var hideMapClass = '.js--hide--map';
      var legendClass = '.explore--map-legend';
      var headerClass = '.header-container';
      var headerContainer = document.querySelector(headerClass);
      var subHeaderClass = '.sub-header-container';
      var subHeaderContainer = document.querySelector(subHeaderClass);
      var mapContainer = document.querySelector('#map');
      var cachedOffsetTop;

      var setMapPosition = function() {
        if(!!navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS/i) ||
          window.innerWidth <= 540) {

          mapContainer.style.top =  '130px';
          if(!isMapOpened()) {
            mapContainer.style.left = window.innerWidth + 'px';
          }
        }

        if (window.innerWidth > 580 && window.innerWidth <= 800) {
            mapContainer.style.top =  '130px';
            mapContainer.style.left = window.innerWidth + 'px';
        };
      };
      var isMapOpened = function() {
        return checkbox.checked;
      };
      var fixSubHeaderPosition = function() {
        if(isMapOpened()) { return; }

        var offsetTop = subHeaderContainer.offsetTop;
        if(window.scrollY > offsetTop && !$(subHeaderClass).hasClass('is-fixed')) {
          cachedOffsetTop = offsetTop;
          $(subHeaderClass).toggleClass('is-fixed');
        } else if(window.scrollY < cachedOffsetTop && $(subHeaderClass).hasClass('is-fixed')) {
          $(subHeaderClass).toggleClass('is-fixed');
        }
      };

      window.addEventListener('resize', setMapPosition);
      setMapPosition();
      window.addEventListener('scroll', fixSubHeaderPosition);
      fixSubHeaderPosition();

      checkbox.addEventListener('change', _.bind(function() {

        if(isMapOpened()) {
          if($(hideMapClass).hasClass('is-hidden')) {
            $(hideMapClass).toggleClass('is-hidden');
          }
          if(!$(showMapClass).hasClass('is-hidden')) {
            $(showMapClass).toggleClass('is-hidden');
            setTimeout(this.map.invalidateSize.bind(map), 1100);
          }
          if(!$(legendClass).hasClass('is-hidden')) {
            setTimeout(function() { $(legendClass).toggleClass('is-mobile-hidden'); }, 800);
          }

          var offsetTop = subHeaderContainer.offsetTop;
          if(window.scrollY < offsetTop) {
            if(!$(headerClass).hasClass('is-fixed')) {
              $(headerClass).toggleClass('is-fixed');
            }
            if($(subHeaderClass).hasClass('is-fixed')) {
              $(subHeaderClass).toggleClass('is-fixed');
            }
            mapContainer.style.top =  '114px';
          } else {
            if(!$(subHeaderClass).hasClass('is-fixed')) {
              $(subHeaderClass).toggleClass('is-fixed');
            }
            mapContainer.style.top =  '33px';
          }


          mapContainer.style.left = '0';
        } else {
          if($(showMapClass).hasClass('is-hidden')) {
            $(showMapClass).toggleClass('is-hidden');
            setTimeout(this.map.invalidateSize.bind(map), 1100);
          }
          if(!$(hideMapClass).hasClass('is-hidden')) {
            $(hideMapClass).toggleClass('is-hidden');
          }
          if($(headerClass).hasClass('is-fixed')) {
            $(headerClass).toggleClass('is-fixed');
          }
          if(!$(legendClass).hasClass('is-hidden')) {
            $(legendClass).toggleClass('is-mobile-hidden');
          }

          mapContainer.style.left = window.innerWidth + 'px';
          fixSubHeaderPosition();
        }
      }, this));
    },

    setListeners: function() {
      $('.js--map-expand').on('click', this.mapExpandButton);

      $('.add-to-map').on('click', _.bind(function(e) {
        var $el = $(e.currentTarget),
            id = $el.data('id');

        if (this.selectedVisualisations[id] === undefined ||
          this.selectedVisualisations[id] == null) {
          this.addLayerToMap(id, $el);
        } else {
          this.removeLayerFromMap(id, $el);
        }
      }, this));
    },

    mapExpandButton: function(e) {
      e.preventDefault();

      if(this.hideLegend) {
        this.renderLegend({ force: !$('.js--explore--map').hasClass('explore--map-open') });
      }

      $('.js--explore--map').toggleClass('explore--map-open');
      $('.js--explore--content').toggleClass('explore--content-closed');

      var iconEl = $('.explore--map-button i');
      if ($('.js--explore--map').hasClass('explore--map-open')) {
        iconEl.removeClass('fa-chevron-left');
        iconEl.addClass('fa-chevron-right');
      } else {
        iconEl.removeClass('fa-chevron-right');
        iconEl.addClass('fa-chevron-left');
      }

      setTimeout(this.map.invalidateSize.bind(this.map), 1100);
    },

    renderLegend: function(options) {
      var $legendEl = $('.explore--map-legend');
      if (!_.compact(this.selectedVisualisations).length ||
        this.hideLegend && !(options && options.force)) {
        $legendEl.hide();
        return;
      }

      var $list = $('.explore--map-legend-layers');
      $list.empty();

      this.selectedVisualisations.forEach(_.bind(function(value, key) {
        if(!!value) {
          var layerId = this.mapVisualisations.indexOf(this.mapVisualisations[key]);
          var isLayerVisible = this.selectedVisualisations[layerId].isVisible();

          var li = '<li><!--<span class="bullet">--></span>'+this.mapVisualisations[key].name;
          li += '<span class="onoffswitch' + (!isLayerVisible ? ' off"' : '"');
          li += 'data-id="'+this.mapVisualisations.indexOf(this.mapVisualisations[key])+'"><span></span></span></li>';

          $list.append(li);
        }
      }, this));

      $list.find('.onoffswitch').off().on('click', _.bind(function(e) {
        var $el = $(e.currentTarget),
            id  = $el.data('id');
        this.toggleLayer(id, $el);
      }, this));

      $legendEl.show();
    },

    addLayerToMap: function(id, $el, callback) {
      $el.text("Active");
      $el.addClass("explore--active-dataset");

      var layerUrl = this.mapVisualisations[id].url;
      cartodb.createLayer(this.map, layerUrl, { legends: false })
        .addTo(this.map)
        .on('done', _.bind(function(layer) {
          layer.setZIndex(id === 1 ? 10 : id);
          this.selectedVisualisations[id] = layer;
          this.renderLegend();
          sessionStorage.setItem('layers', JSON.stringify(this.getSelectedVisualisationsIndex()));

          if(callback) { callback(id); }
        }, this));
    },

    removeLayerFromMap: function(id, $el) {
      var layer = this.selectedVisualisations[id];
      this.map.removeLayer(layer);

      $el.text("Add to map");
      $el.removeClass("explore--active-dataset");

      this.selectedVisualisations[id] = null;
      this.renderLegend();
      sessionStorage.setItem('layers', JSON.stringify(this.getSelectedVisualisationsIndex()));
    },

    toggleLayer: function(id, $el) {
      var layer = this.selectedVisualisations[id];
      if(layer.isVisible()) {
        layer.hide();
        $el.addClass('off');
      } else {
        layer.show();
        $el.removeClass('off');
      }
      sessionStorage.setItem('layers', JSON.stringify(this.getSelectedVisualisationsIndex()));
    },

    getSelectedVisualisationsIndex: function() {
      var indexes = this.selectedVisualisations.map(function(cell, index) {
        return cell !== undefined && cell !== null && cell !== false && index;
      });

      var res = [];

      indexes.forEach(_.bind(function(cell) {
        if(cell !== undefined && cell !== null && cell !== false) {
          var isVisible = this.selectedVisualisations[cell].isVisible();
          res.push({ id: cell, visible: isVisible });
        }
      }, this));

      return res;
    }

  });

  return ExploreView;

});
