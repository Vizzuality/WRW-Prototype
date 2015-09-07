define([
  'underscore',
  'backbone',
  'backbone-super',
  'events',
  'views/abstract/base',
  'views/card',
  'views/tags',
  'helpers/helper',
  'collections/graphs', 'collections/tags',
  'text!templates/app.handlebars'
], function(_, Backbone, bSuper, Events, BaseView, CardView, TagsView, helper,
  GraphsCollection, TagsCollection, TPL) {

  'use strict';

  var App = BaseView.extend({

    template: TPL,

    events: {
      'click input[type=submit]'   : 'setCountry',
      'change .choose-country' : 'setCountry'
    },

  	initialize: function(options) {
      this.iso = options.iso || 'BRA';
      /* If we can't find this ISO, we redirect to the homepage */
      if(!_.findWhere(helper.getCountries(), { iso: this.iso })) {
        Events.trigger('route:update');
        this.iso = null;
        this.render();
        return;
      }
      this.graphs = new GraphsCollection();
      this.tags   = new TagsCollection();

      this.render();
      this.fetchConfiguration();
  	},

    setCountry: function(e) {
      e.preventDefault();

      this.iso = $('.choose-country').val();
      this.appEvents.trigger('route:update', { iso: this.iso });
      this.fetchConfiguration();
    },

    renderDashboard: function(graphs) {
      if (graphs === undefined) { graphs = this.graphs; }
      this.cardsCount = graphs.models.length;

      this.render();
      this.renderTags();

      for(var i = 0; i < this.cardsCount; i++) {
        var cardView = new CardView({
          el: $('.card'+i),
          configuration: graphs.at(i).toJSON(),
          iso: this.iso,
          id: i
        });

        var o = {};
        o['cardView'+i] = cardView;
        this.addView(o);
      }
    },

    setupTags: function() {
      this.listenTo(this.tags, 'change', function() {
        var filteredGraphs = this.graphs.filterByTags(this.tags);
        filteredGraphs.on('sync', function() {
          this.renderDashboard(filteredGraphs);
        }.bind(this));
      }.bind(this));
    },

    renderTags: function() {
      var tagsView = new TagsView({tags: this.tags});
      $('#dashboard-tags').html(tagsView.render().el);
    },

    fetchConfiguration: function() {
      this.$el.addClass('is-loading');

      $.when(this.graphs.fetch(), this.tags.fetch())
        .done(function() {
          this.renderDashboard(this.graphs);
          this.setupTags(this.tags, this.graphs);
        }.bind(this))

        .fail(function(xhr, type, statusText) {
          var $alertBox = $('div');
          $alertBox.addClass('alert-box alert');
          $alertBox.text('Couldn\'t retrieve the configuration: ' + statusText);
          this.$el.find('.row').last().append($alertBox);
        }.bind(this))

        .always(function() {
          this.$el.removeClass('is-loading');
        }.bind(this));
    },

  	serialize: function() {
      if(!this.iso) {
        return { countries: helper.getCountries() };
      }

      return {
        countries: helper.getCountries(),
        country: _.findWhere(helper.getCountries(), { iso: this.iso }).name,
        iso: this.iso,
        cardsCount: this.cardsCount
      };
  	},

    afterRender: function() {
      if(!_.isEmpty(this.views) && _.isEmpty(this.graphs)) {
        this.fetchConfiguration();
      }
    },

    destroy: function() {
      this.$el.html('');
    }

  });

  return App;

});
