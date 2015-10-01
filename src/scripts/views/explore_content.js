define([
  'underscore',
  'backbone',
  'handlebars',
  'text!views/templates/data_card.handlebars'
], function(_, Backbone, Handlebars, TPL) {

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

  var SimilarCollection = Backbone.Collection.extend({

    initialize: function(options) {
      this.id = options && options.id;
    },

    url: function() {
      return 'https://insights.cartodb.com/api/v2/sql?q=with r as (SELECT max(cartodb_id) as max_num FROM explore_table_config), f as (select distinct  x  from (select round(random() * max_num) as x from  generate_series(1,200), r) q where x != ' + this.id + ' limit 5) select * from explore_table_config, f where cartodb_id = f.x';
    },

    parse: function(data) {
      return data && data.rows;
    }

  });

  var ExploreStandaloneView = Backbone.View.extend({

    template: Handlebars.compile(TPL),

    initialize: function(options) {
      this.areExploreCards = options && options.explore;

      this.exploreModel = new ExploreModel({ id: window.location.hash.replace('#', '') });
      this.similarCollection = new SimilarCollection({ id: window.location.hash.replace('#', '') });

      $.when.apply($, [this.exploreModel.fetch(), this.similarCollection.fetch()])
        .then(_.bind(this.render, this))
        .fail(function() {
          console.log('Error fetching the data');
        })
        .always(function() {
          $('.is-loading').removeClass('is-loading');
        });
    },

    render: function() {
      var contentData = this.exploreModel.toJSON()[0];
      var similarData = this.similarCollection.toJSON();

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
      $('.js-likes-count').text(('' + contentData.likes_count).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('.js-content').html(contentData.content);
      $('.js-credits').html('<a href="' + contentData.url_author + '">Online source</a><br>' + contentData.long_citation);
      $('title').text(contentData.name + ' | Resource Watch');

      _.each(similarData, function(card) {
        this.$el.append(this.template(_.extend(card, {
          explore: this.areExploreCards,
          data_id: card.cartodb_id <= 3 ? '' + (card.cartodb_id - 1) : null
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

  return ExploreStandaloneView;

});
