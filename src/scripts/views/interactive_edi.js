define([
  'backbone',
  'underscore',
  'handlebars',
  'views/search_countries',
  'text!views/templates/interactive_edi_step2.handlebars',
  'text!views/templates/interactive_edi_step3.handlebars'
], function(Backbone, _, Handlebars, SearchCountriesView, TPL2, TPL3) {

  var EdiCollection = Backbone.Collection.extend({
    initialize: function(options) {
      this.iso = options && options.iso;
    },

    url: function() {
      return 'http://edi.simbiotica.es/indicators-by/' + this.iso;
    },

    parse: function(data) {
      return _.map(data, function(row) {
        return {
          indicatorId: parseInt(row['indicator-id']),
          score: parseInt(row.score) > 1
        }
      });
    }
  });

  var InsightsCollection = Backbone.Collection.extend({

    url: 'https://insights.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20edi_insight',

    parse: function(data) {
      return _.map(data && data.rows, function(row) {
        return {
          condition: JSON.parse(row.indicatorsid),
          sentence: Handlebars.compile(row.phrase),
          order: row.group_id
        };
      });
    }
  });

  var ScoreModel = Backbone.Model.extend({

    initialize: function(options) {
      this.iso = options && options.iso;
    },

    url: function() {
      return 'http://edi.simbiotica.es/overall-by-country/' + this.iso;
    },

    parse: function(data) {
      return {
        score: data[0].score,
        strength: parseFloat(data[0].score) < 1 ? 'weak' : (parseFloat(data[0].score)  > 2 ? 'strong' : 'average')
      }
    }
  });

  var CountryModel = Backbone.Model.extend({
    initialize: function(options) {
      this.iso = options && options.iso;
    },

    url: function() {
       return 'http://edi.simbiotica.es/country-info/' + this.iso;
    },

    parse: function(data) {
      return {
        name: data[0]['Name'],
        population: data[0]['Population'],
        grp: data[0]['GRP'],
        hdi: data[0]['HDI'],
        edi: data[0]['EPI'],
        isFederal: !!(data[0] && data[0]['Federal'])
      };
    }

  });

  var CountriesCollection = Backbone.Collection.extend({

    url: 'http://edi.simbiotica.es/countries-by-overall',
    comparator: 'name',

    initialize: function() {
      this.fetch();
    },

    parse: function(data) {
      return _.map(data, function(row) {
        return {
          iso: row.field_iso,
          name: row.country
        };
      });
    }
  });

  var InteractiveEdi = Backbone.View.extend({

    el: 'body',

    events: {
      'click .js-next': 'nextStep'
    },

    template2: Handlebars.compile(TPL2),
    template3: Handlebars.compile(TPL3),

    initialize: function() {
      this.step = 0;
      this.$container = $('.js-container');
      this.$introContainer = $('.js-intro-container');
      this.$intro2Container = $('.js-intro-2-container');
      this.$card = $('.js-card');
      this.$cardFront = $('.insights--interactive-card-front');
      this.$cardBack = $('.insights--interactive-card-back');
      this.$countryInput = $('.js-search-country');
      this.countriesCollection = new CountriesCollection();
      this.setListeners();
    },

    setListeners: function() {
      this.countriesCollection.on('sync', _.bind(this.updateCountriesList, this));
    },

    updateCountriesList: function() {
      _.each(this.countriesCollection.toJSON(), _.bind(function(country) {
        this.$countryInput.append('<option value="'+country.iso+'">'+country.name+'</option>');
      }, this));
    },

    nextStep: function(e) {
      e.preventDefault();

      switch(this.step) {
        case 0:
          this.step++;
          this.$container.toggleClass('bg-ramesh-02 bg-ramesh-01');
          this.$introContainer.css({ opacity: 0 });
          /* CSS transition of 200ms for the opacity */
          setTimeout(_.bind(function() {
            this.$intro2Container.fadeIn(300);
          }, this), 300);
          break;

        case 1:
          this.step++;
          this.$cardBack.css({
            position: 'absolute',
            top: '0px'
          });
          this.$cardBack.removeClass('is-hidden');
          this.$card.addClass('is-flipped');
          /* CSS transition of 1s for the flip */
          setTimeout(_.bind(function() {
            this.$cardBack.css({
              position: 'static'
            });
            this.$cardFront.addClass('is-hidden');
          }, this), 1000);
          break;

        case 2:
          this.iso = this.$countryInput.find('option:selected').val();

          if(!!this.iso.length) {
            this.ediCollection = new EdiCollection({ iso: this.iso });
            this.insightsCollection = new InsightsCollection();
            this.countryModel = new CountryModel({ iso: this.iso });
            this.scoreModel = new ScoreModel({ iso: this.iso });

            $.when.apply($, [this.scoreModel.fetch(), this.countryModel.fetch(), this.ediCollection.fetch(), this.insightsCollection.fetch()])
              .then(_.bind(this.renderResult, this))
              .fail(function() {
                console.log('Error fetching the data');
              });
          }
          break;
      }
    },

    previousStep: function() {
      if(this.step === 3) {
        this.$cardBack.html(this.template2());
        this.$countryInput = $('.js-search-country');
        this.updateCountriesList();
        $('html, body').animate({
          scrollTop: this.$cardBack.offset().top
        }, 500);
        this.step--;
      }
    },

    renderResult: function() {
      var ediData = this.ediCollection.toJSON();
      var insightsData = this.insightsCollection.toJSON();
      var countryData = this.countryModel.toJSON();
      var scoreData = this.scoreModel.toJSON();

      var conditions;
      var sentences = _.map(_.sortBy(_.map(_.compact(_.map(insightsData, function(row) {
        conditions = row.condition;
        var indicator, condition;
        for(var i = 0, j = conditions.length; i < j; i++) {
          condition = conditions[i];
          indicator = _.findWhere(ediData, { indicatorId: condition.indicatorid });
          if(indicator.score !== condition.value) {
            return false;
          }
        }
        return { sentence: row.sentence, order: row.order };
      })), function(o) {
        return {
          sentence: o.sentence.apply(this, [{
            iso: countryData.name,
            is_federal: countryData.isFederal ? 'federal' : ''
          }]),
          order: o.order
        };
      }), 'order'), function(o) {
        return o.sentence;
      });

      this.step++;
      this.$cardBack.children().fadeOut(300, _.bind(function() {
        this.$cardBack.html(this.template3({
          sentences: sentences,
          country: countryData.name,
          iso: this.iso,
          population: countryData.population,
          grp: countryData.grp,
          hdi: countryData.hdi,
          edi: countryData.edi,
          score: scoreData.score,
          strength: scoreData.strength
        }));
        $('.js-back').on('click', _.bind(this.previousStep, this));
      }, this));
    }

  });

  return InteractiveEdi;

});
