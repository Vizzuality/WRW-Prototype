define([
  'backbone', 'handlebars', 'd3', 'jquery',
  'explore/line_chart', 'explore/pie_chart',
  'text!explore/templates/chart.hbs'
], function(
  Backbone, Handlebars, d3, $,
  LineChart, PieChart,
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

      $(window).off('resize');
      if (type === 'line') {
        this._renderLine();
      } else {
        this._renderPie();
      }

      return this;
    },

    _renderLine: function() {
      var keys = { x: 'date', y: 'price' };
      var parseDate = d3.time.format("%b %Y").parse;
      var type = function(d) {
        d[keys.x] = parseDate(d[keys.x]);
        d[keys.y] = +d[keys.y];
        return d;
      }

      d3.csv("scripts/explore/line_chart_test.csv", type, function(error, data) {
        var lineChart = new LineChart({
          data: data,
          el: this.el,
          sizing: {top: 10, right: 0, bottom: 100, left: 0},
          innerPadding: { top: 25, right: 20, bottom: 0, left: 45 },
          keys: keys
        });

        lineChart.render();
      }.bind(this));
    },

    _renderPie: function() {
      d3.json("scripts/explore/pie_chart_test.json", function(error, data) {
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
