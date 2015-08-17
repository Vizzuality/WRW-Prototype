require.config({

  baseUrl: 'js/explore',

  paths: {
    jquery:     '../vendor/jquery/dist/jquery.min',
    underscore: '../vendor/underscore/underscore-min',
    backbone:   '../vendor/backbone/backbone-min',
    handlebars: '../vendor/handlebars/handlebars.amd.min',
    d3:         '../vendor/d3/d3',
    text:       '../vendor/text/text'
  },

  shim: {
    d3: { exports: 'd3' }
  }

});

require(['jquery', 'chart_view'],
  function($, ChartView) {

  var chartView = new ChartView({el: '.js--detail-visualization'});
  chartView.render();

});
