define([
  'backbone',
  'underscore',
  'handlebars',
  'text!views/templates/data_card.handlebars'
], function(Backbone, _, Handlebars, TPL) {

  'use strict';

  var ExploreCollection = Backbone.Collection.extend({

    initialize: function(options) {
      this.limit = options && options.limit;
    },

    url: function() {
      var limit = this.limit ? ' LIMIT ' + this.limit : '';
      return 'https://insights.cartodb.com/api/v2/sql?q=SELECT * FROM explore_table_config' + limit;
    },

    parse: function(data) {
      return data && data.rows;
    }

  });

  var ExploreDatasets = Backbone.View.extend({

    template: Handlebars.compile(TPL),

    initialize: function(options) {
      this.areExploreCards = options && options.explore;
      this.exploreCollection = new ExploreCollection({ limit: options && options.limit });
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

      /* FAV */
      var stars = document.querySelector('.hero-info-stars');
      var insightStar = document.querySelector('.insights--featured-info-stars');
      var starsCard = document.getElementsByClassName('card-info-stars');
      var mapStar = document.querySelector('.story--metadata-stars');
      var insights = document.querySelector('.insights--star');
      var explore = document.querySelector('.explore-detail--stars');

      var doFav = function() {
        //regex to remove commas at thousands
        var totalFavsContainer = this.querySelector('span'),
            totalFavs = parseInt(totalFavsContainer.innerText.replace(/,/g, ""))

        if(this.classList.contains('active')) {
          totalFavs--;
        } else {
          totalFavs++;
        }

        this.classList.toggle('active');

        //regex to insert commas at thousands
        totalFavs = totalFavs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        totalFavsContainer.innerText = totalFavs;
      };

      // Add events
      if (stars) {
        stars.onclick = doFav;
      }

      if (insights) {
        insights.onclick = doFav;
      }

      if (explore) {
        explore.onclick = doFav;
      }

      if (insightStar) {
        insightStar.onclick = doFav;
      }

      if (mapStar) {
        mapStar.onclick = doFav;
      };


      if (starsCard.length > 0) {
        for (var i = 0; i < starsCard.length; i++) {
          starsCard[i].onclick = doFav;
        }
      }
    }

  });

  return ExploreDatasets;

});
