define([
  'underscore',
  'backbone',
  'backbone-super',
  'd3',
  'd3chart',
  'moment',
  'views/abstract/base',
  'views/chart',
  'views/map',
  'views/infowindow',
  'text!templates/card.handlebars'
], function(_, Backbone, bSuper, d3, d3chart, moment, BaseView, ChartView,
  MapView, Infowindow, TPL) {

  'use strict';

  var CardView = BaseView.extend({

    template: TPL,

    initialize: function(options) {
      this.configuration = options.configuration || {};
      this.iso = options.iso || 'SPA';
      this.collection = new (Backbone.Collection.extend({}))();
      this.id = options.id || this.cid;
      this.render();
      this.fetchData();
    },

    fetchData: function() {
      this.$el.addClass('is-loading');
      var endpoint,
          query;
      if(this.configuration.fetch_method === 'query') {
        endpoint = 'https://insights.cartodb.com/api/v2/sql?q=';
        query = this.configuration.endpoint.replace(/{{iso}}/i, this.iso);
        endpoint = endpoint + encodeURIComponent(query);
        this.collection.parse = function(data) { return data.rows; };
        this.collection.fetchMethod = 'query';
      }
      else {
        endpoint = this.configuration.endpoint.replace(/{{iso}}/i, this.iso);
        this.collection.fetchMethod = 'api';
      }

      var cardConf = JSON.parse(this.configuration.configuration) || {};
      var type = _.pluck(cardConf.y, 'type');

      if(_.contains(type, 'map')) {
        this.generateMap(query, cardConf, this.iso);
      } else {
        this.collection.url = endpoint;
        this.collection.fetch()
          .done(_.bind(function(data) {
            var isEmpty;

            if (data.hasOwnProperty('rows') && data.rows.length === 0||
              Object.keys(data).length === 0) {
              isEmpty = true;
            }

            if (isEmpty) {
              this.generateEmptyMessage();
            } else {
              this.generateChart();
            }

          }, this))
          .fail(_.bind(function(status) {
            var $alertBox = $(document.createElement('div'));
            $alertBox.addClass('alert-box alert');
            $alertBox.text('Couldn\'t load the data');
            this.$el.append($alertBox);
          }, this))
          .always(_.bind(function() {
            this.$el.removeClass('is-loading');
          }, this));
      }
    },

    generateEmptyMessage: function() {
      var $chart = $(document.createElement('div'));
      $chart.addClass('chart chart-'+this.id);
      this.$el.append($chart);

      var $alertBox = $(document.createElement('div'));
      $alertBox.addClass('alert-box alert').text('No data available');

      $chart.append($alertBox);
    },

    openInfowindow: function() {
      var infowindow = document.createElement('div');
      infowindow.className = 'm-modal-window';
      if(!isFullscreen) {
        $('body').append(infowindow);
      } else {
        $('.container').append(infowindow);
      }
      var configuration = JSON.parse(this.configuration.configuration);
      new Infowindow({
        el: '.m-modal-window',
        title: configuration.info.title || '',
        content: configuration.info.content || ''
      });
    },

    generateMap: function(query, params, country) {
      var self = this;
      var mapId = 'map-'+Math.floor((Math.random() * 100000) + 1);
      var mapContainer = '<div id="'+mapId+'" class="l-map"></div>';
      this.$el.find('.card-graph').append(mapContainer);
      this.$el.find('.card-graph').addClass('map');

      /* We add an info button */
      var btn = document.createElement('div');
      btn.className = 'btn-info';
      btn.appendChild(document.createTextNode('i'));
      $(btn).on('click', _.bind(this.openInfowindow, this));
      this.$el.append(btn);

      var cartocss = params.y && params.y[0] &&
                     params.y[0].cartocss ? params.y[0].cartocss : '';

      var map = new MapView({
        options: {
          container: mapId,
          params: {
            q: query,
            cartocss: cartocss,
            country: country
          }
        }
      });

      map.addMap();
      map.listenTo(map, 'layer:loaded', function() {
        self.$el.removeClass('is-loading');
      });
    },

    generateChart: function() {
      var configuration = JSON.parse(this.configuration.configuration) || {};
      /* We check the color of the card */
      if(configuration.importance) {
        this.$el.addClass('relevant-'+configuration.importance);
      }
      /* dateRegex is the regex used to detect if x axis values are dates */
      var dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
      /* We generate the SVG container */
      var $chart = $(document.createElement('div'));
      $chart.addClass('chart chart-'+this.id);
      this.$el.find('.card-graph').append($chart);
      /* data stores the object which directly contains the values we need */
      var data = this.collection.toJSON();
      if(configuration.path) {
        var path = configuration.path.split('.');
        data = data[0]; /* We assume that we fetch the data from an api */
        for(var i = 0, j = path.length; i < j; i++) { data = data[path[i]]; }
      }
      /* If no data, we display a message */
      if(data.length === 0) {
        var $alertBox = $(document.createElement('div'));
        $alertBox.addClass('alert-box alert').text('No data available');
        $chart.append($alertBox);
        if(configuration.importance) {
          this.$el.removeClass('relevant-'+configuration.importance);
        }
        return;
      }
      /* We add an info button */
      var btn = document.createElement('div');
      btn.className = 'btn-info';
      btn.appendChild(document.createTextNode('i'));
      $(btn).on('click', _.bind(this.openInfowindow, this));
      this.$el.append(btn);
      /* Here are the basic chart options */
      var chartHeight =  this.$el.find('.card-graph').height() - this.$el.find('h6').height() - this.$el.find('h5').height() - $chart.outerHeight(true);
      var chartWidth =  this.$el.find('.card-graph').width();
      var options =  {
        height: chartHeight,
        width: chartWidth,
        el: '.chart-'+this.id,
        xAxis: {
          tickCount: 7
        },
        yAxis: {
          showLabel: true,
          showGrid: true,
          tickCount: 6
        },
        showTrail: true
      };

      var origData = _.clone(configuration);
      /* x stores the x values */
      var x;
      if(!configuration.x) { x = null; }
      else {
        x = data.map(function(row) {
          if(dateRegex.test(row[configuration.x.name])) {
            options.xAxis.timeserie = true;
            return new Date(row[configuration.x.name]);
          }
          return row[configuration.x.name];
        });
      }
      /* y stores all the curves */
      var y = _.range(configuration.y.length).map(function() { return []; });
      /* We stores the values in the y array */
      for(var i = 0, j = configuration.y.length; i < j; i++) {
        y[i] = data.map(function(row) { return row[configuration.y[i].name]; });
      }
      /* Each curve gets its name and its data */
      var curves = [];
      for(var i = 0, j = configuration.y.length; i < j; i++) {
        var values = [];
        var serieLength = (!!x) ? x.length : y.length;
        for(var k = 0, l = serieLength; k < l; k++) {
          values.push({ x: !!x ? x[k] : null, y: y[i][k] });
        }
        curves[i] = { values: values, label: configuration.y[i].label };
        /* We apply curve-specific changes */
        if(this.configuration.graph_name === 'Forma - Alerts') {
          curves[i].values.shift(); /* We remove the value from 2005 */
        }

        curves[i].type = configuration.y[i].type;
        curves[i].unit = configuration.y[i].units;
      }
      /* We determine the type of chart */
      var chartType = 'lineChart';
      var lines = 0, bars = 0, pie = 0, textual = 0, compareBars = 0, rank = 0;
      for(var i = 0, j = configuration.y.length; i < j; i++) {
        switch(configuration.y[i].type) {
          case 'lines':
            lines++;
            break;
          case 'bars':
            bars++;
            break;
          case 'pie':
            pie++;
            break;
          case 'textual':
            textual++;
            break;
          case 'compare-bars':
            compareBars++;
            break;
          case 'rank':
            rank++;
            break;
          default:
            console.log('Unsupported type of chart');
            break;
        }
      }
      if(lines && !bars)      { options.type = 'Line'; }
      else if(pie)            { options.type = 'Pie'; }
      else if(bars && !lines) { options.type = 'Bar'; }
      else if(lines && bars)  { options.type = 'BarLine'; }
      else if(textual)        { options.type = 'Textual'; }
      else if(compareBars)    { options.type = 'Compare-Bar'; }
      else if(rank)           { options.type = 'Rank'; }

      /* If we have specified previously a tickCount for the xAxis, we need to
         adapt it for the BarLine chart that don't support it */
      if(options.xAxis.tickCount && (options.type === 'BarLine' || options.type === 'Bar') && curves[0]) {
        var mod = Math.round(curves[0].values.length / options.xAxis.tickCount) + 1;
        options.xAxis.tickFormat = function(d, i) {
          return i%mod ? null : d;
        };
      }
      /* We add point to the curve */
      // if(options.type === 'Line') {
      //   options.pointType = 'circle';
      //   options.pointSize = 1;
      // }
      /* We define the number of color categories for the pie chart */
      if(options.type === 'Pie') {
        options.colorCount = 4;
      }

      if(this.configuration.graph_name === 'Deforestation - Alerts') {
        curves[0].values = _.filter(curves[0].values, function(curve) {
          var date = moment(curve.x);
          if(date.format('YYYY') >= 2006) {
            return curve;
          }
        });
      }

      options.series = curves;

      if(options.type === 'Rank') {
        options.series = this.formatRankData();
      }

      /* We create the chart instance */
      this.chart = d3chart(options);
      /* We automatically resize the chart when the window is resized */
      this.resizeChart = _.debounce(_.bind(function() {
        this.$el.find('svg').remove();
        var chartHeight =  this.$el.find('.card-graph').height() - this.$el.find('h6').height() - this.$el.find('h5').height() - $chart.outerHeight(true);
      var chartWidth =  this.$el.find('.card-graph').width();
        options.height = chartHeight;
        options.width = chartWidth;
        this.chart = d3chart(options);
        this.$el.removeClass('is-loading');
      }, this), 300);
      $(window).resize(_.bind(function() {
        this.$el.addClass('is-loading');
        this.resizeChart();
      }, this));
    },

    formatRankData: function() {
      var collection = this.collection.toJSON();
      var cardType = 'relevant-2';
      var currentCountry = this.collection.where({iso: this.iso});
      var ranking = [];
      var result = [];
      var lastResult = [];
      var middle = [];

      if(currentCountry.length) {
        currentCountry = currentCountry[0].toJSON();

        var rank = currentCountry.rank;
        /* Last position */
        var maxRank = _.max(collection, function(model) {
          return model.rank;
        });

        if(rank >= 1 && rank <= 5) {
          for(var i = 0; i <= 5; i++) {
            var countryData = this.collection.where({rank: i});
            if(countryData[0]) {
              countryData = countryData[0].toJSON();
              countryData.cardType = cardType;
              countryData.current = false;

              if(countryData.iso === this.iso) {
                countryData.current = true;
              }
              ranking.push(countryData);
            }
          }

          var lastItem = this.collection.where({rank: maxRank.rank});
          if(lastItem.length > 0) {
            lastResult.push(lastItem[0].toJSON());
          }
        } else if(rank >= (maxRank.rank - 4) && rank <= maxRank.rank) {
          cardType = 'relevant-1';
          for(var i = (maxRank.rank - 4); i <= maxRank.rank; i++) {
            var countryData = this.collection.where({rank: i});
            if(countryData[0]) {
              countryData = countryData[0].toJSON();
              countryData.cardType = cardType;
              countryData.current = false;

              if(countryData.iso === this.iso) {
                countryData.current = true;
              }
              lastResult.push(countryData);
            }
          }
          var firstItem = this.collection.where({rank: 1});
          if(firstItem.length > 0) {
            ranking.push(firstItem[0].toJSON());
          }
        } else {
          for(var i = (rank - 1); i <= rank+1; i++) {
            var countryData = this.collection.where({rank: i});
            if(countryData[0]) {
              countryData = countryData[0].toJSON();
              countryData.cardType = cardType;
              countryData.current = false;

              if(countryData.iso === this.iso) {
                countryData.current = true;
              }
              middle.push(countryData);
            }
          }

          var firstItem = this.collection.where({rank: 1});
          if(firstItem.length > 0) {
            ranking.push(firstItem[0].toJSON());
          }

          var lastItem = this.collection.where({rank: maxRank.rank});
          if(lastItem.length > 0) {
            lastResult.push(lastItem[0].toJSON());
          }
        }

        if(ranking.length > 0 || lastResult.length > 0) {
          result = [];
          result[0] = ranking;
          result[1] = lastResult;
          result[2] = middle;
        }
        this.$el.addClass(cardType);
      } else {
        this.generateEmptyMessage();
        this.$el.removeClass('is-loading');
      }

      return result;
    },

    serialize: function() {
      return {
        name: this.configuration.graph_name,
        category: this.configuration.category_name
      };
    },

    beforeDestroy: function() {
      this.$el.find('.btn-info').off('click');
      $(window).off('resize');
    }

  });

  return CardView;

});
