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
  'views/explore_standalone',
  'explore/chart_view',
  'views/interactive_edi',
  'views/interactive_map',
  'views/explore_datasets',

  // Common modules
  // TODO: refactor them
  'views/user_menu',
  'views/mobile_menu',
  'views/fav',
  'views/empty_links',
  'views/fullscreen'
], function(Backbone, Router, auth, LoginView, SearchCountriesView, GlobeView,
    DashboardView, SlideshowView, MapView, ExploreView,
    ExploreStandaloneView, ChartView, InteractiveEdiView, InteractiveMapView,
    ExploreDatasetsView) {

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
      this.router.on('route:partnersGp', this.partnersGp, this);
      this.router.on('route:partnersWwf', this.partnersWwf, this);
      this.router.on('route:partnersVizzuality', this.partnersVizzuality, this);
      this.router.on('route:partnersWri', this.partnersWri, this);
      this.router.on('route:slideshow', this.slideshow, this);
      this.router.on('route:slideshowPeru', this.slideshowPeru, this);
      this.router.on('route:map', this.map, this);
      this.router.on('route:interactiveEdi', this.interactiveEdi, this);
      this.router.on('route:interactiveMap', this.interactiveMap, this);
      this.router.on('route:explore', this.explore, this);
      this.router.on('route:exploreDetail', this.exploreDetail, this);
      this.router.on('route:exploreStandalone', this.exploreStandalone, this);
      this.router.on('route:appInfo', this.appInfo, this);
      this.router.on('route:default', this.default, this);

    },

    homepage: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
        new ExploreDatasetsView({ el: '.js-explore-datasets' });
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
        if (hash.length > 3 && hash.match(/topic/)) {
          hash = hash.split('/topic/');
          new DashboardView({ el: '#container', iso: hash[0], topic: hash[1] });
        } else {
          new DashboardView({ el: '#container', iso: hash });
        }
      });
    },

    partnersGp: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    partnersWwf: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    partnersVizzuality: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    partnersWri: function() {
      this._checkAuth(function() {
        new SearchCountriesView({ el: '.choose-country' });
      });
    },

    slideshow: function() {
      this._checkAuth(function() {
        new SlideshowView();
      });
    },

    slideshowPeru: function() {
      this._checkAuth(function() {
        new SlideshowView();
      });
    },

    map: function() {
      this._checkAuth(function() {
        new MapView();
      });
    },

    interactiveEdi: function() {
      this._checkAuth(function() {
        new InteractiveEdiView();
      });
    },

    interactiveMap: function() {
      this._checkAuth(function() {
        new InteractiveMapView();
      });
    },

    explore: function() {
      this._checkAuth(function() {
        new ExploreDatasetsView({ el: '.js-explore-datasets', explore: true });
        setTimeout(function() { new ExploreView(); }, 1000);
      });
    },

    exploreDetail: function() {
      this._checkAuth(function() {
        new ExploreView();
        new ChartView({el: '.js--detail-visualization'}).render();
      });
    },

    exploreStandalone: function() {
      this._checkAuth(function() {
        new ExploreStandaloneView();
        new ChartView({el: '.js--detail-visualization'}).render();
      });
    },

    appInfo: function() {
      this._checkAuth();
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
      } else if (!window.location.href.match(/login.html/)) {
        window.location.href = 'login.html';
      }
    },

    start: function() {
      var path = '/WRW-Prototype/';
      if(window.location.hostname === 'localhost' || /192\.168\.1\.[0-9]{2}/.test(window.location.hostname)) {
        path = '/';
      }
      Backbone.history.start({ pushState: true, root: path });
    }

  });

  var app = new App();

  app.start();

});
