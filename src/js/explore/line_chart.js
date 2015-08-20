define([
 'jquery', 'd3', 'underscore',
 'line_chart_context', 'line_chart_interaction_handler'
], function(
  $, d3, _,
  LineChartContext, LineChartInteractionHandler
) {

var svg, x, y, xKey, yKey, xAxis, yAxis;

var line = d3.svg.line()
  .interpolate('monotone')
  .x(function(d) { return x(d[xKey]); })
  .y(function(d) { return y(d[yKey]); });

var LineChart = function(options) {
  this.options = options;
  this.data = options.data;

  this.sizing = options.sizing;
  this.width = $(this.options.el).outerWidth() - this.sizing.margin.left - this.sizing.margin.right,
  this.height = $(this.options.el).outerHeight() - this.sizing.margin.top - this.sizing.margin.bottom,

  this._createEl();
  this._createDefs();
  this._createScales();

  window.addEventListener('resize', _.debounce(this.resize.bind(this), 100));
};

LineChart.prototype.resize = function() {
  window.removeEventListener('resize', _.debounce(this.resize.bind(this), 100));
  $(this.options.el).empty();
  new LineChart(this.options).render();
};

LineChart.prototype._createEl = function() {
  var fullWidth = this.width + this.sizing.margin.left + this.sizing.margin.right,
      fullHeight = this.height + this.sizing.margin.top + this.sizing.margin.bottom;

  svg = d3.select(this.options.el)
    .append("svg")
      .attr('class', 'lineChart')
      .attr("width", fullWidth)
      .attr("height", fullHeight);
};

LineChart.prototype._createScales = function() {
  xKey = this.options.keys.x;
  yKey = this.options.keys.y;

  x = d3.time.scale().range([0, this.width]);
  x.domain(d3.extent(this.data.map(function(d) { return d[xKey]; })));

  y = d3.scale.linear().range([this.height, 10]);
  y.domain([0, d3.max(this.data.map(function(d) { return d[yKey]; }))]);
};

LineChart.prototype._createDefs = function() {
  svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", this.width)
    .attr("height", this.height);
};

LineChart.prototype._drawAxes = function(group) {
  xAxis = d3.svg.axis().scale(x).orient("bottom");
  yAxis = d3.svg.axis().scale(y).tickSize(-this.width, 0).orient("left");

  group.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + this.height + ")")
    .call(xAxis);

  group.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text")
      .attr("y", -10)
      .attr("x", 5)
      .style("text-anchor", "start");
};

LineChart.prototype._drawLine = function(group) {
  group.append("path")
    .datum(this.data)
    .attr("class", "line")
    .attr("d", line);
};

LineChart.prototype._drawContext = function(group) {
  var contextGroup = svg.append("g").attr("class", "context")

  var context = new LineChartContext({
    el: this.options.el,
    data: this.data,
    group: contextGroup,
    sizing: {
      width: this.width,
      height: this.sizing.height
    },
    keys: this.options.keys,
    domain: {
      x: x.domain(),
      y: y.domain()
    },
    onBrush: function(newDomain) {
      x.domain(newDomain);
      group.select(".line").attr("d", line);
      group.select(".x.axis").call(xAxis);
    }
  });
  context.render();
};

LineChart.prototype._setupHandlers = function() {
  var eventInterceptor = svg.append("rect")
    .attr("class", "overlay")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("transform", "translate(" + this.sizing.margin.left + "," + this.sizing.margin.top + ")");

  var handler = new LineChartInteractionHandler(svg, {
    width: this.width,
    height: this.height,
    sizing: this.sizing,
    data: this.data,
    keys: this.options.keys,
    interceptor: eventInterceptor,
    x: x,
    y: y
  });
};

LineChart.prototype.render = function() {
  var group = svg.append("g")
    .attr("class", "focus")
    .attr("transform",
      "translate(" + this.sizing.margin.left + "," + this.sizing.margin.top + ")");

  this._drawAxes(group);
  this._drawLine(group);
  this._setupHandlers();
  this._drawContext(group);
};

return LineChart;

});
