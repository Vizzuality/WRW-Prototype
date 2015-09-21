define([
  'underscore',
  'backbone',
  'handlebars'
], function(_, Backbone, Handlebars) {

  'use strict';

  var URL = 'https://insights.cartodb.com/api/v2/sql?q=';
  var BASE_QUERY     = "SELECT s.* FROM table_spec s",
      DEFAULT_CLAUSE = "WHERE s.visible = true",
      TAGS_CLAUSE    = Handlebars.compile("JOIN table_spec_tags tt ON (s.cartodb_id = tt.spec_id) JOIN tags t ON (tt.tag_id = t.cartodb_id) WHERE s.visible = true and tt.tag_id IN ({{tag_ids}})");

  var GraphsCollection = Backbone.Collection.extend({

    url: URL + BASE_QUERY + " " + DEFAULT_CLAUSE,

    parse: function(data) { return data.rows; },

    filterByTags: function(tags) {
      var selectedTags = _.pluck(tags.where({selected: true}), 'id');

      if (selectedTags.length > 0) {
        var filteredCollection = new GraphsCollection();
        filteredCollection.url = URL + BASE_QUERY + " " + TAGS_CLAUSE({tag_ids: selectedTags.join(',')});
        console.log(filteredCollection.url);
        filteredCollection.fetch();

        return filteredCollection;
      } else {
        this.fetch();
        return this;
      }
    }

  });

  return GraphsCollection;

});
