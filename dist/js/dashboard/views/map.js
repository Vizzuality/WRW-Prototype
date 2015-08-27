define([
  'backbone',
  'underscore'
], function(Backbone, _) {

  'use strict';

  var MapCard = Backbone.View.extend({

    defaults: {
      username: 'insights',
      map: {
        center: [43.872158236415416, -79.56024169921875],
        zoom: 9,
        minZoom: 2,
        zoomControl: false
      },
      zoom: {
        position: 'topright'
      },
      countriesQuery: 'SELECT bbox FROM countries WHERE adm0_a3 = \'{{iso}}\''
    },

    initialize: function(settings) {
      var self = this;
      var options = settings && settings.options ? settings.options : {};
      this.options = _.extend(this.defaults, options || {});

      this.map = L.map(this.options.container, this.options.map);
      // L.control.zoom(this.options.zoom).addTo(this.map);
      L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-light/{z}/{x}/{y}.png').addTo(this.map);

      var countryQuery = this.options.countriesQuery.replace(/{{iso}}/i, this.options.params.country);
      var sql = new cartodb.SQL({ user: this.options.username });
      sql.execute(countryQuery).done(function(res) {
        var geojson = self.toGeoJSON(res);
        var countryGeo = L.geoJson(geojson, {});
        self.map.fitBounds(countryGeo.getBounds());
      });

      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
    },

    /**
     * Add a layer to map
     * @param  {Object} map
     */
    addMap: function() {
      var self = this;
      var options = _.clone(this.options);
      var map = this.map;

      cartodb.createLayer(map, {
        user_name: options.username,
        type: 'cartodb',
        sublayers: [{
          sql: options.params.q,
          cartocss: options.params.cartocss
        }]
      })
      .addTo(map)
      .done(function(layer) {
        self.layer = layer;

        layer.bind('load', function() {
          self.trigger('layer:loaded');
        });
      });
    },

    /**
     * Removes a laye
     */
    removeLayer: function() {
      if (this.map && this.layer) {
        this.map.removeLayer(this.layer);
      }
    },

    updateLayer: function() {
      this.removeLayer();
      this.addMap(this.map);
    },

    panToLayer: function() {
      var bounds = this.bounds;

      if(bounds) {
        this.map.fitBounds(bounds, {maxZoom: this.map.getZoom()});
      }
    },

    toGeoJSON: function(data) {
      var geojson = {
        type: 'FeatureCollection',
        features: _.map(data.rows, function(d) {
          var bbox = JSON.parse(d.bbox);
          return bbox;
        })
      };
      return geojson;
    }
  });

  return MapCard;

});
