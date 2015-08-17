define(['d3'], function(d3) {
  var commaify = function(number, dec, dsep, tsep) {
    if (isNaN(number) || number == null) { return number; }

    number = number.toFixed(~~dec);
    tsep = typeof tsep == 'string' ? tsep : ',';

    var parts = number.split('.'),
      fnums = parts[0],
      decimals = parts[1] ? (dsep || '.') + parts[1] : '';

    return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
  };

  var COLORS = ["#25A2C3", "#1A8CAA", "#0F6F89", "#075469"],
      HIGHLIGHT_COLOR = "#C32D7B";

  var svg, colorScale, labelKey, valueKey;

  var arc = d3.svg.arc().innerRadius(0).outerRadius(150),
      largeArc = d3.svg.arc().innerRadius(0).outerRadius(160),
      pie = d3.layout.pie().value(function(d){ return d[valueKey]; });

  var PieChart = function(options) {
    this.options = options;
    this.data = options.data;

    this.sizing = options.sizing;
    this.width = this.sizing.width - this.sizing.margin.left - this.sizing.margin.right,
    this.height = this.sizing.height - this.sizing.margin.top - this.sizing.margin.bottom,

    this._createEl();
    this._createScales();
  };

  PieChart.prototype._createEl = function() {
    svg = d3.select(this.options.el)
      .append('svg')
        .attr('class', 'pieChart')
        .attr('width', this.width)
        .attr('height', this.height);
  };

  PieChart.prototype._createScales = function() {
    colorScale = d3.scale.linear().domain([0,this.data.length]).range(COLORS);

    valueKey = this.options.keys.value;
    labelKey = this.options.keys.label;
  };

  PieChart.prototype._drawArcs = function(group) {
    var max = d3.max(this.data, function(d) { return +d[valueKey]; });

    group.append('path')
      .attr('d', function(d) {
        var fn = arc;
        if (d[valueKey] === max) { fn = largeArc; }
        return fn(d);
      })
      .attr('fill', function(d,i) {
        if (d[valueKey] === max) {
          return HIGHLIGHT_COLOR;
        } else {
          return colorScale(i);
        }
      });
  };

  PieChart.prototype._drawLabel = function(group, key, className, offset) {
    if (offset === undefined) { offset = 0; }

    group.append("text").attr({
      x: function (d, i) {
        centroid = arc.centroid(d);
        midAngle = Math.atan2(centroid[1], centroid[0]);
        x = Math.cos(midAngle) * 175;
        sign = (x > 0) ? 1 : -1
        labelX = x + (5 * sign)
        return labelX;
      },

      y: function (d, i) {
        centroid = arc.centroid(d);
        midAngle = Math.atan2(centroid[1], centroid[0]);
        y = Math.sin(midAngle) * 175 + offset;
        return y;
      },

      'text-anchor': function (d, i) {
        centroid = arc.centroid(d);
        midAngle = Math.atan2(centroid[1], centroid[0]);
        x = Math.cos(midAngle) * 175;
        return (x > 0) ? "start" : "end";
      },

      'class': 'label-text ' + className
    }).text(function (d) {
      var value = d.data[key];
      return commaify(value);
    });
  };

  PieChart.prototype._drawLabels = function(group) {
    var labels = svg.append('g')
      .attr('class', 'labels')
      .attr('transform','translate(' + (this.sizing.width/2) + ',' + (this.sizing.height/2) + ')');

    var enteringLabels = labels.selectAll(".label")
      .data(pie(this.data))
      .enter();

    var labelGroups = enteringLabels.append("g")
      .attr("class", "label");

    this._drawLabel(labelGroups, labelKey, 'labelTitle');
    this._drawLabel(labelGroups, valueKey, 'labelSubtitle', 20);
  };

  PieChart.prototype.render = function() {
    var group = svg.append('g')
        .attr('transform','translate(' + (this.sizing.width/2) + ',' + (this.sizing.height/2) + ')')
      .selectAll('.arc')
      .data(pie(this.data))
      .enter()
      .append('g')
        .attr('class',"arc");

    this._drawArcs(group);
    this._drawLabels(group);
  };

  return PieChart;
});
