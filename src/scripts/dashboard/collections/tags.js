define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  'use strict';

  var QUERY = "SELECT * FROM tags";

  var Tag = Backbone.Model.extend({
    defaults: {
      selected: false
    },

    idAttribute: 'cartodb_id'
  });

  var TagsCollection = Backbone.Collection.extend({

    model: Tag,

    url: 'https://insights.cartodb.com/api/v2/sql?q=' + QUERY,
    parse: function(data) { return data.rows; }

  });

  return TagsCollection;

});
