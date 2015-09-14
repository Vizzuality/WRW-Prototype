define([
  'underscore',
  'backbone',
  'backbone-super',
  'dashboard/views/abstract/base'
], function(_, Backbone, bSuper, BaseView) {

  'use strict';

  var ChartView = BaseView.extend({

    template: 'HOLA',

    initialize: function() {
    },

  });

  return ChartView;

});
