define([
  'backbone',
  'underscore',
  'handlebars',
  'text!views/templates/data_card.handlebars'
], function(Backbone, _, Handlebars, TPL) {

  'use strict';

  var ExploreCollection = Backbone.Collection.extend({

    url: 'https://insights.cartodb.com/api/v2/sql?q=SELECT * FROM explore_table_config',

    parse: function(data) {
      return data && data.rows;
    }

  });

  var ExploreDatasets = Backbone.View.extend({

    template: Handlebars.compile(TPL),

    initialize: function(options) {
      this.areExploreCards = options && options.explore;
      this.exploreCollection = new ExploreCollection();
      this.exploreCollection.fetch().done(_.bind(this.render, this));
    },

    render: function() {
      var data = this.exploreCollection.toJSON();
      _.each(data, function(card) {
        this.$el.append(this.template(_.extend(card, {
          explore: this.areExploreCards,
          data_id: card.cartodb_id <= 3 ? '' + (card.cartodb_id - 1) : null,
          likes_count: ('' + card.likes_count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })));
      }, this);
    }

  });

  return ExploreDatasets;

});
