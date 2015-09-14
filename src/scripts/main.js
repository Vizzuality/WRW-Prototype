require([
  'backbone',
  'router',
  'helpers/auth',

  'views/login_form',
  'views/search_countries',
  'views/globe',
  'dashboard/app',

  // Common modules
  // TODO: refactor them
  'views/user_menu',
  'views/mobile_menu',
  'views/fav',
  'views/empty_links',
  'views/fullscreen'
], function(Backbone, Router, auth,
  LoginView, SearchCountriesView, GlobeView, DashboardView) {

  var App = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      this.router = new Router();
      this.setListeners();
    },

    setListeners: function() {
      this.router.on('route:login', this.login, this);
      this.router.on('route:homepage', this.homepage, this);
      this.router.on('route:planetPulse', this.planetPulse, this);
      this.router.on('route:countries', this.countries, this);
    },

    homepage: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    login: function() {
      new LoginView({ el: '#content' });
    },

    planetPulse: function() {
      this._checkAuth(function() {
        var globe = new GlobeView({ el: '#globe' });
        globe.checkHash();
        $(window).on('hashchange', function() {
          globe.checkHash();
        });
      });
    },

    countries: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
        console.log('showing countries...');
        var hash = window.location.hash.split('/');
        new App({ el: '#container', iso: hash[1] || 'BRA'});
      });
    },

    /**
     * Middleware to check user session
     */
    _checkAuth: function(next) {
      var isLogged = auth.checkLogin();
      if (isLogged && next && typeof next === 'function') {
        this.$el.addClass('is-logged');
        next.apply(this);
      } else {
        window.location.href = 'login.html';
      }
    },

    start: function() {
      Backbone.history.start({ pushState: true });
    }

  });

  var app = new App();

  app.start();

});
