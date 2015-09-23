define([
  'underscore',
  'backbone',
  'handlebars'
], function(_, Backbone, Handlebars) {

  'use strict';

  var ExploreModel = Backbone.Model.extend({

    initialize: function(options) {
      this.id = options && options.id;
    },

    url: function() {
      return 'https://insights.cartodb.com/api/v2/sql?q=SELECT * FROM explore_table_config WHERE cartodb_id=' + this.id;
    },

    parse: function(data) {
      return data && data.rows;
    }

  });

  var ExploreCollection = Backbone.Collection.extend({

    url: 'https://insights.cartodb.com/api/v2/sql?q=SELECT * FROM explore_table_config',

    parse: function(data) {
      return data && data.rows;
    }

  });

  var ExploreStandaloneView = Backbone.View.extend({

    initialize: function() {
      this.exploreModel = new ExploreModel({ id: window.location.hash.replace('#', '') });
      this.exploreCollection = new ExploreCollection();

      $.when.apply($, [this.exploreModel.fetch(), this.exploreCollection.fetch()])
        .then(_.bind(this.render, this))
        .fail(function() {
          console.log('Error fetching the data');
        });
    },

    render: function() {
      var contentData = this.exploreModel.toJSON()[0];
      var similarData = this.exploreCollection.toJSON();

      var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      var date = '-';
      if(contentData.last_update) {
        date = new Date(contentData.last_update);
        date = months[date.getMonth()] + ', ' + date.getDate() + ' ' +
          date.getFullYear();
      }

      $('.js-title').text(contentData.name);
      $('.js-author').text(contentData.author);
      $('.js-date').text(date);
      $('.js-likes').toggleClass('is-active', contentData.is_liked);
      $('.js-likes-count').text(contentData.likes_count);
      $('.js-content').html(contentData.content);
      $('title').text(contentData.name + ' | Resource Watch');
    }

  });

  return ExploreStandaloneView;

});
