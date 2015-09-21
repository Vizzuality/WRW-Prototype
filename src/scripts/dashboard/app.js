define([
  'underscore',
  'backbone',
  'backbone-super',
  'dashboard/events',
  'dashboard/views/abstract/base',
  'dashboard/views/card',
  'dashboard/views/tags',
  'dashboard/helpers/helper',
  'views/fullscreen',
  'dashboard/collections/graphs',
  'dashboard/collections/tags',
  'text!dashboard/templates/app.handlebars'
], function(_, Backbone, bSuper, Events, BaseView, CardView, TagsView, helper, fullscreen,
  GraphsCollection, TagsCollection, TPL) {

  'use strict';

  var App = BaseView.extend({

    template: TPL,

    events: {
      'click input[type=submit]'   : 'setCountry',
      'change .choose-country' : 'setCountry',
      'click #fullscreenBtn': 'toggleFullscreen',
      'click #countryToggleBtn': 'countryToggle',
      'click #topicsToggleBtn': 'topicsToggle'
    },

  	initialize: function(options) {
      this.fullscreenCount = 0;
      _.bindAll(this, 'fullscreenWatcher');
      this.setListeners(); // Must be the first instruction

      this.iso = options.iso;
      this.topic = options.topic;

      if (this.iso) {
        /* If we can't find this ISO, we redirect to the homepage */
        if(!_.findWhere(helper.getCountries(), { iso: this.iso })) {
          this.appEvents.trigger('route:update');
          this.iso = null;
          this.render();
          return;
        }
      }

      // if(!options.iso) {
      //   this.appEvents.trigger('route:update', { iso: this.iso });
      // }
      var _this = this;

      this.graphs = new GraphsCollection();
      this.tags   = new TagsCollection();

      if (this.iso || this.topic) {
        this.render();
        this.fetchConfiguration();

        this.$toolbars = $('.m-country-selector');
        this.$countryToggle = $('#countryToggle');
      }

      $(window).on('hashchange', function() {
        if (window.location.hash.match(/topic/)) {
          var hash = window.location.hash.replace('#', '');
          hash = hash.split('/topic/');
          _this.iso = hash[0];
          _this.topic = hash[1];
          _this.render();
          _this.fetchConfiguration();

          _this.$toolbars = $('.m-country-selector');
          _this.$countryToggle = $('#countryToggle');
        }
      });
  	},

    countryToggle: function(e) {
      e.preventDefault();
      $('#topicsToggle').addClass('is-hidden');
      $('#countryToggle').toggleClass('is-hidden');
    },

    topicsToggle: function(e) {
      e.preventDefault();
      $('#countryToggle').addClass('is-hidden');
      $('#topicsToggle').toggleClass('is-hidden');
    },

    setListeners: function() {
      this.listenTo(this.appEvents, 'route:update', this.updateHash);
      var fullscreenEvents = 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange';
      $(document).on(fullscreenEvents, this.fullscreenWatcher);
    },

    updateHash: function(o) {
      window.location.hash = (o && o.iso) ? '#'+o.iso : '';
    },

    setCountry: function(e) {
      e.preventDefault();

      this.iso = $('.choose-country').val();
      this.topic = null;
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
          var $alertBox = $('.alert-box');
          $alertBox.removeClass('is-hidden');
          $alertBox.text('Couldn\'t retrieve the configuration: ' + statusText);
        }.bind(this))

        .always(function() {
          this.$el.removeClass('is-loading');
        }.bind(this));
    },

    toggleFullscreen: function(e) {
      e.preventDefault();
      fullscreen.toggleFullscreen();
    },

    fullscreenWatcher: function() {
      var isEnteringFullscreen = this.fullscreenCount % 2 === 0;
      this.fullscreenCount++;

      if(isEnteringFullscreen && !fullscreen.isFullscreen()) {
        this.enableFullscreen();
      } else if(!isEnteringFullscreen && fullscreen.isFullscreen()) {
        this.disableFullscreen();
      }
    },

    enableFullscreen: function() {
      var container = document.querySelector('#content');
      var gridbox = container.querySelector('.gridbox');
      var button = container.querySelector('#fullscreenBtn');

      fullscreen.setFullscreen(true);

      container.className += ' is-fullscreen';

      var innerWidth = container.offsetWidth - parseInt(window.getComputedStyle(container, null).getPropertyValue('padding-left')) - parseInt(window.getComputedStyle(container, null).getPropertyValue('padding-right'));
      var nbCardsARow = Math.round(innerWidth / (320 + 2 * 20));
      gridbox.style.width = (320 + 2 * 20) * nbCardsARow + 'px';

      button.textContent = 'Exit Full screen';
    },

    disableFullscreen: function() {
      var container = document.querySelector('#content');
      var gridbox = container.querySelector('.gridbox');
      var button = container.querySelector('#fullscreenBtn');

      fullscreen.setFullscreen(false);

      container.className = 'container';

      gridbox.style.width = 'auto';

      button.textContent = 'Full screen';
    },

  	serialize: function() {
      if(!this.iso && !this.topic) {
        return { countries: helper.getCountries() };
      }
      return {
        countries: helper.getCountries(),
        country: _.findWhere(helper.getCountries(), { iso: this.iso }).name,
        iso: this.iso,
        topic: this.topic,
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
