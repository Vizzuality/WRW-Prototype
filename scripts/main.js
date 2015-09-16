require([
  'backbone',
  'router',
  'helpers/auth',

  'views/login_form',
  'views/search_countries',
  'views/globe',
  'dashboard/app',
  'views/slideshow',
  'views/map',
  'views/explore',
  'explore/chart_view',

  // Common modules
  // TODO: refactor them
  'views/user_menu',
  'views/mobile_menu',
  'views/fav',
  'views/empty_links',
  'views/fullscreen'
], function(Backbone, Router, auth, LoginView, SearchCountriesView, GlobeView,
  DashboardView, SlideshowView, MapView, ExploreView, ChartView) {

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
      this.router.on('route:partners', this.partners, this);
      this.router.on('route:partnersWwf', this.partnersWwf, this);
      this.router.on('route:slideshow', this.slideshow, this);
      this.router.on('route:map', this.map, this);
      this.router.on('route:explore', this.explore, this);
      this.router.on('route:exploreDetail', this.exploreDetail, this);
      this.router.on('route:default', this.default, this);

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
        var hash = window.location.hash.replace('#', '');
        new DashboardView({ el: '#container', iso: hash });
      });
    },

    partners: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    partnersWwf: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    slideshow: function() {
      this._checkAuth(function() {
        new SlideshowView();
      });
    },

    map: function() {
      this._checkAuth(function() {
        new MapView();
      });
    },

    explore: function() {
      this._checkAuth(function() {
        new ExploreView();
      });
    },

    exploreDetail: function() {
      this._checkAuth(function() {
        new ExploreView();
        new ChartView({el: '.js--detail-visualization'}).render();
      });
    },

    default: function() {
      this._checkAuth();
    },

    /**
     * Middleware to check user session
     */
    _checkAuth: function(next) {
      var isLogged = auth.checkLogin();
      if (isLogged) {
        this.$el.addClass('is-logged');
        if(next && typeof next === 'function') {
          next.apply(this);
        }
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
