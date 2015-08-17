define([
  'underscore',
  'backbone',
  'backbone-super',
  'events',
  'views/abstract/base',
  'views/card',
  'helpers/helper',
  'collections/graphs',
  'text!templates/app.handlebars'
], function(_, Backbone, bSuper, Events, BaseView, CardView, helper,
  GraphsCollection, TPL) {

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
      this.render();
      this.fetchConfiguration();
  	},

    setCountry: function(e) {
      e.preventDefault();
      this.iso = $('.choose-country').val();
      this.appEvents.trigger('route:update', { iso: this.iso });
      this.fetchConfiguration();
    },

    setDashboard: function() {
      this.cardsCount = this.collection.models.length;
      this.render();
      for(var i = 0; i < this.cardsCount; i++) {
        var cardView = new CardView({
          el: $('.card'+i),
          configuration: this.collection.models[i].attributes,
          iso: this.iso,
          id: i
        });
        var o = {};
        o['cardView'+i] = cardView;
        this.addView(o);
      }
    },

    fetchConfiguration: function() {
      this.$el.addClass('is-loading');
      this.collection = new GraphsCollection();
      this.collection.fetch()
        .done(_.bind(function() { this.setDashboard(); }, this))
        .fail(_.bind(function(status) {
          var $alertBox = $(document.createElement('div'));
          $alertBox.addClass('alert-box alert');
          $alertBox.text('Couldn\'t retrieve the configuration: ' +
            status.statusText);
          this.$el.find('.row').last().append($alertBox);
        }, this))
        .always(_.bind(function() {
          this.$el.removeClass('is-loading');
        }, this));
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
      if(!_.isEmpty(this.views)) {
        if(!this.collection) {
          this.fetchConfiguration();
        }
      }
    },

    destroy: function() {
      this.$el.html('');
    }

  });

  return App;

});
