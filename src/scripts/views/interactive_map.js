define([
  'backbone',
  'underscore',
  'text!views/templates/interactive_map_infowindow.handlebars',
  'jqueryUi'
], function(Backbone, _, infowindowTPL) {

  var InteractiveMap = Backbone.View.extend({

    initialize: function() {
      this.$map = $('#js-map');
      this.$slider = $('.slider');
      this.$switch = $('.onoffswitch');

      this.availableYears = [20, 30, 40];
      this.yearSelection = this.availableYears[0];
      this.scenario = 28;
      this.baseMaps = {
        "Basemap": L.tileLayer('https://a.tiles.mapbox.com/v4/smbtc.7d2e3bf9/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic21idGMiLCJhIjoiVXM4REppNCJ9.pjaLujYj-fcCPv5evG_0uA', {maxZoom: 18, zIndex:0})
      };
      this.countryLayer = {
        user_name: 'insights',
        type: 'cartodb',
        sublayers: [{
          sql: 'SELECT * FROM countriedata',
          cartocss:'#countriedata{ polygon-fill: transparent; polygon-opacity: 0.7; line-color: #000000; line-width: 0.5; line-opacity: 0.1;}',
        interactivity: ['name', 'avg','prev_2020','net_exports','production','consumption']
        }]
      };

      this.renderSlider();
      this.renderMap();
      this.setListeners();
    },

    setListeners: function() {
      this.$switch.on('click', _.bind(this.toggleLayer, this));
    },

    getStressScenario: function(year, scenario) {
      return {
        user_name: 'insights',
        type: 'cartodb',
        sublayers: [{
            sql: 'SELECT * FROM aqueduct_projections_20150309',
          cartocss:'#aqueduct_projections_20150309 {'+
          'polygon-opacity:1;'+
          'polygon-gamma:.2;'+
          'polygon-fill: rgba(0,0,0,0);'+
          '[ws' + year + scenario + 'cl="2.8x or greater decrease"] { polygon-fill:#0099cc; }'+
          '[ws' + year + scenario + 'cl="2x decrease"]   { polygon-fill:#73afd1;  }'+
          '[ws' + year + scenario + 'cl="1.4x decrease"] { polygon-fill:#abc7d9;  }'+
          '[ws' + year + scenario + 'cl="Near normal"]   { polygon-fill:#ddd; }'+
          '[ws' + year + scenario + 'cl="1.4x increase"] { polygon-fill:#f8ab95;  }'+
          '[ws' + year + scenario + 'cl="2x increase"]   { polygon-fill:#ff7351;  }'+
          '[ws' + year + scenario + 'cl="2.8x or greater increase"] { polygon-fill:#ff1900; }}'
        },

        {
          sql: "select * from irrigation",
          cartocss: '#irrigation {raster-opacity:1; raster-colorizer-default-mode: discrete; raster-scaling:lanczos; raster-colorizer-stops: stop(2,rgba(255,255,255,0)) stop(10,rgba(255,255,255,1)) stop(50,rgba(255,255,255,1)) stop(255,rgba(255,255,255,1)); comp-op: dst-in;}',
          raster: true,
          raster_band: 1
        }]
      };
    },

    renderMap: function() {
      if(!this.map) {
        this.map = L.map('js-map', {
          scrollWheelZoom: true,
          center: [8.928487062665504, 39.5947265625,],
          zoom: 3,
          zoomControl: false,
          layers:[this.baseMaps.Basemap]
        });

        L.control.zoom({ position: 'topright' }).addTo(this.map);
      }

      if(!!this.layer) {
        this.map.removeLayer(this.layer);
      }

      if(!!this.infowindowLayer) {
        this.map.removeLayer(this.infowindowLayer);
      }

      if(!!this.infowindow) {
        this.infowindow.remove();
      }

      cartodb.createLayer(this.map, this.getStressScenario(this.yearSelection, this.scenario)).done(_.bind(function(layer) {
        this.layer = layer;
        this.map.addLayer(layer);
      }, this));

      cartodb.createLayer(this.map, this.countryLayer).addTo(this.map).done(_.bind(function(layer) {
        this.infowindowLayer = layer;
        var subLayer = layer.getSubLayer(0);
        this.infowindow = cartodb.vis.Vis.addInfowindow(this.map, subLayer, this.countryLayer.sublayers[0].interactivity, {
          infowindowTemplate: (this.renderInfowindowTemplate)()
        });
      }, this));

      this.$switch.removeClass('off');
    },

    renderSlider: function() {
      this.$slider.slider({
        min: _.min(this.availableYears),
        max: _.max(this.availableYears),
        step: 10,
        change: _.bind(this.setYear, this)
      });
    },

    setYear: function(e, ui) {
      this.yearSelection = ui.value;
      this.renderMap();
    },

    toggleLayer: function(e) {
      this.$switch.toggleClass('off');
      this.layer.toggle();
    },

    renderInfowindowTemplate: function() {
      return infowindowTPL.replace(/\%year\%/gi, '20' + this.yearSelection);
    }

  });

  return InteractiveMap;

});
