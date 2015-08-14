require.config({

  baseUrl: 'js/explore',

  paths: {
    jquery:     '../vendor/jquery/dist/jquery.min',
    underscore: '../vendor/underscore/underscore-min',
    backbone:   '../vendor/backbone/backbone-min',
    handlebars: '../vendor/handlebars/handlebars.amd.min',
    d3:         '../vendor/d3/d3'
  },

  shim: {
    d3: { exports: 'd3' }
  }

});

require(['jquery', 'd3', 'line_chart', 'pie_chart'],
  function($, d3, LineChart, PieChart) {

  var keys = { x: 'date', y: 'price' };
  var parseDate = d3.time.format("%b %Y").parse;
  var type = function(d) {
    d[keys.x] = parseDate(d[keys.x]);
    d[keys.y] = +d[keys.y];
    return d;
  }

  d3.csv("js/explore/line_chart_test.csv", type, function(error, data) {
    var className = '.js--detail-visualization',
        $el = $(className);

    var sizing = {
      margin: {top: 10, right: 0, bottom: 100, left: 0},
      width: $el.outerWidth(),
      height: $el.outerHeight()
    };

    var lineChart = new LineChart({
      data: data,
      el: className,
      sizing: sizing,
      keys: keys
    });

    lineChart.render();
  });

  //d3.json("pie_chart_test.json", function(error, data) {
    //var sizing = {
      //margin: {top: 10, right: 0, bottom: 90, left: 0},
      //width: 960,
      //height: 500
    //};

    //var pieKeys = { value: 'value', label: 'label' };

    //var pieChart = new PieChart({
      //data: data,
      //el: '.pieChart',
      //sizing: sizing,
      //keys: pieKeys
    //});

    //pieChart.render();
  //});

});
