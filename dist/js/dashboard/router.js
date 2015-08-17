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
      'backbone-super-min'
  },

  shim: {
    d3:   { exports: 'd3' }
  }

});

require([
  'underscore',
  'backbone',
  'events',
  'app'
], function(_, Backbone, Events, App) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      '(:iso)': 'default'
    },

    initialize: function() {
      Backbone.history.start({pushState: false});
      this.setListeners();
    },

    setListeners: function() {
      Events.on('route:update', this.update, this);
    },

    update: function(params) {
      this.navigate(params && params.iso || null);
    },

    default: function(iso) {
      if(this.app) {
        this.app.destroy();
        this.app.render();
        return;
//        var container = document.createElement('div');
//        container.className = 'container';
//        container.id = 'container';
//        $(container).insertAfter('.header-container');
      }
      this.app = new App({ el: '#container', iso: iso});
    }

  });

  new Router();

});
