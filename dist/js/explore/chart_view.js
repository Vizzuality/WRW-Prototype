define([
  'backbone', 'handlebars', 'd3', 'jquery',
  'line_chart', 'pie_chart', 'scatter_chart',
  'text!templates/chart.hbs'
], function(
  Backbone, Handlebars, d3, $,
  LineChart, PieChart, ScatterChart,
  tpl
) {

  var ChartOptions = new (Backbone.Model.extend({
    defaults: {
      vizType: 'line'
    }
  }));

  var ChartView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.listenTo(ChartOptions, 'change:vizType', this.render);
    },

    events: {
      'change select': 'changeType'
    },

    changeType: function(event) {
      var type = $(event.currentTarget).val();
      ChartOptions.set('vizType', type);
    },

    render: function() {
      var type = ChartOptions.get('vizType');
      this.$el.html(this.template({
        isLineChart: (type === 'line')
      }));

      this._renderScatter();
      return this;

      $(window).off('resize');
      if (type === 'line') {
        this._renderLine();
      } else {
        this._renderPie();
      }

      return this;
    },

    _renderScatter: function() {
      d3.json("js/explore/scatter_chart_test.json", function(error, data) {
        var keys = { x: 'carbon_2009', y: 'energy_2009' };

        var scatterChart = new ScatterChart({
          data: data,
          el: this.el,
          sizing: {top: 20, right: 20, bottom: 30, left: 20},
          keys: keys
        });

        scatterChart.render();
      }.bind(this));
    },

    _renderLine: function() {
      var keys = { x: 'date', y: 'price' };
      var parseDate = d3.time.format("%b %Y").parse;
      var type = function(d) {
        d[keys.x] = parseDate(d[keys.x]);
        d[keys.y] = +d[keys.y];
        return d;
      }

      d3.csv("js/explore/line_chart_test.csv", type, function(error, data) {
        var lineChart = new LineChart({
          data: data,
          el: this.el,
          sizing: {top: 10, right: 0, bottom: 100, left: 0},
          keys: keys
        });

        lineChart.render();
      }.bind(this));
    },

    _renderPie: function() {
      d3.json("js/explore/pie_chart_test.json", function(error, data) {
        var pieKeys = { value: 'value', label: 'label' };

        var pieChart = new PieChart({
          data: data,
          el: this.el,
          sizing: {top: 10, right: 0, bottom: 10, left: 0},
          keys: pieKeys
        });

        pieChart.render();
      }.bind(this));
    }

  });

  return ChartView;

});
