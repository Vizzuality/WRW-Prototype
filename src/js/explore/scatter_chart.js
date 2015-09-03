define([
 'jquery', 'd3', 'underscore'
], function(
  $, d3, _
) {

  var svg, x, y, xKey, yKey;
  var color = d3.scale.category10();

  var ScatterChart = function(options) {
    this.options = options;
    this.data = options.data;

    this.sizing = options.sizing;

    this.parentWidth = $(this.options.el).outerWidth();
    this.parentHeight = $(this.options.el).outerHeight();
    this.width = this.parentWidth - this.sizing.left - this.sizing.right,
    this.height = this.parentHeight - this.sizing.top - this.sizing.bottom;

    this._createEl();
    this._createScales();
  };

  ScatterChart.prototype._createEl = function() {
    svg = d3.select(this.options.el)
      .append("svg")
        .attr('class', 'scatterChart')
        .attr("width", this.parentWidth)
        .attr("height", this.parentHeight);
  };

  ScatterChart.prototype._createScales = function() {
    xKey = this.options.keys.x;
    yKey = this.options.keys.y;

    x = d3.scale.linear().range([0, this.width]);
    x.domain(d3.extent(this.data, function(d) { return d[xKey]; })).nice();

    y = d3.scale.linear().range([this.height, 0]);
    y.domain(d3.extent(this.data, function(d) { return d[yKey]; })).nice();
  };

  ScatterChart.prototype._drawAxes = function() {
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis()
          .scale(y)
          .tickSize(-this.parentWidth, 100).orient("left")
          .tickFormat(function(d) {
            var suffix = d3.formatPrefix(d);
            return suffix.scale(d).toFixed() + suffix.symbol;
          });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+(this.sizing.left+20)+"," + this.height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "translate(35,-10)" );
  };

  ScatterChart.prototype.render = function() {
    this._drawAxes();

    var group = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + (this.sizing.left+20) + ",0)");

    group.selectAll(".dot")
        .data(this.data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d[xKey]); })
        .attr("cy", function(d) { return y(d[yKey]); })
        .style("fill", "#fff");
  };

  return ScatterChart;

});

