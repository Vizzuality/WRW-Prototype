define([
  'underscore',
  'backbone',
  'backbone-super'
], function(_, Backbone, bSuper) {

  'use strict';

  var GraphsCollection = Backbone.Collection.extend({

    url: 'https://insights.cartodb.com/api/v2/sql?q=SELECT * FROM table_spec WHERE visible = true',

    parse: function(data) { return data.rows; }

  });

  return GraphsCollection;

});
