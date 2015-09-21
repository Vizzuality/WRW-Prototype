define([
  'underscore',
  'backbone',
  'handlebars'
], function(_, Backbone, Handlebars) {

  'use strict';

  var ExploreView = Backbone.View.extend({
    initialize: function() {
      // Sets the h2 to the url parameter "title"
      document.querySelectorAll('.explore--title')[0].innerHTML = window.location.search.split('?title=')[1].replace(/%20/g,' ');
      //Sets head title to the url parameter "title"
      document.getElementsByTagName('title')[0].innerHTML = window.location.search.split('?title=')[1].replace(/%20/g,' ');
    },
  });

  return ExploreView;

});
