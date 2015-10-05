define([
  'd3',
  'underscore'
], function(d3, _) {

  'use strict';

  var options = {};

  var setDefaults = function(configuration) {
    options.margin = {
      top:    configuration.margin && configuration.margin.top    || 0,
      right:  configuration.margin && configuration.margin.right  || 0,
      bottom: configuration.margin && configuration.margin.bottom || 0,
      left:   configuration.margin && configuration.margin.left   || 0
    };
    /* Like border-box: box-sizing */
    options.width =  configuration.width  || 300;
    options.innerWidth = options.width - options.margin.right - options.margin.left;
    options.height = configuration.height || 200;
    options.innerHeight = options.height - options.margin.top - options.margin.bottom;

    options.xAxis = {
      height: 20,
      timeserie: configuration && configuration.xAxis && configuration.xAxis.timeserie || false,
    };
    options.yAxis = {
      width: 27,
      showLabel: configuration && configuration.yAxis && configuration.yAxis.showLabel || false,
      showGrid: configuration && configuration.yAxis && configuration.yAxis.showGrid || false
    };

    if(configuration && configuration.xAxis && configuration.xAxis.tickCount) {
      options.xAxis.tickCount = configuration.xAxis.tickCount;
    }

    if(configuration && configuration.yAxis && configuration.yAxis.tickCount) {
      options.yAxis.tickCount = configuration.yAxis.tickCount;
    }

    if(configuration && configuration.xAxis && configuration.xAxis.tickFormat &&
       typeof configuration.xAxis.tickFormat === 'function') {
      options.xAxis.tickFormat = configuration.xAxis.tickFormat;
    }

    options.pointType = configuration.pointType || null;
    options.pointSize = configuration.pointSize || 0;
    options.showTrail = configuration.showTrail || false;
    options.colorCount = configuration.colorCount || 5;

    if(!configuration.el) {
      console.warn('A container for the chart must be specified.');
      return -1;
    }
    options.el = d3.select(configuration.el);

    if(!configuration.series || !configuration.series.length) {
      console.warn('At least one serie must be specified');
      return -1;
    }
    options.series = configuration.series;
  };

  var appendBars = function(svg, x, y, values, className) {
    svg.append('g')
      .attr('transform', 'translate('+options.yAxis.width+', 0)')
      .selectAll('.bar')
      .data(values)
      .enter().append('rect')
        .attr('class', 'bar '+(className || ''))
        .attr('x', function(d) { return x(d.x) || 0; })
        .attr('width', x.rangeBand())
        .attr('y', function(d) { return y(d.y) || 0; })
        .attr('height', function(d) { return options.innerHeight - options.xAxis.height - (y(d.y) || 0); });
  };

  var appendLines = function(svg, x, y, values, xOffset, yOffset, className) {
    var xOffset = xOffset || 0,
        yOffset = yOffset || 0;
    var className = className || '';
    var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });
    svg.append('path')
      .attr('transform', 'translate('+(options.yAxis.width + xOffset)+', '+yOffset+')')
      .datum(values)
      .attr('class', 'line '+className)
      .attr('d', line);
    /* We add the points */
    if(options.pointType === 'circle') {
      svg.append('g')
        .attr('class', 'points')
        .attr('transform', 'translate('+(options.yAxis.width + xOffset)+', '+yOffset+')')
        .selectAll('.point')
        .data(values)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('cx', function(d) { return x(d.x); })
        .attr('cy', function(d) { return y(d.y); })
        .attr('r', options.pointSize);
      }
  };

  /* Returns the number of time the number can be divided by 1000 */
  var getFactor = function(number) {
    var tmp = number;
    var factor = 0;
    while(tmp >= 1) {
      tmp /= 1000;
      factor++;
    }
    return --factor;
  };

  var generateTrail = function(svg) {
    if(!options.showTrail) { return; }
    // svg.on('mousemove', function(d) {
    //   console.log(d3.event);
    // });
  };

  var textual = function(configuration) {
    var ret = setDefaults(configuration);
    if(ret === -1) { return; }
    /* We create the svg elements */
    var svg = options.el.append('svg')
      .attr('class', 'textual-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight);
    /* Gauge chart*/
    if(options.series.length === 1) {
      var text = svg.append('g')
          .append('text')
          .attr('class', 'value')
          .attr('transform', function(d) { return 'translate('+(options.width / 2)+', '+(options.height / 2)+')'; })
          .attr('dy', '.3em')
          .style('text-anchor', 'middle')
          .text(Math.round(options.series[0].values[0].y)+options.series[0].unit);
      /* The arc params */
      var radians = d3.scale.linear()
        .range([- 3 * Math.PI / 4, 3 * Math.PI / 4]);
      var arc = d3.svg.line.radial()
        .interpolate('basis')
        .tension(0)
        .angle(function(d) { return radians(d); });
      var padding = 20;
      var radius = Math.min(options.width - padding, options.height - padding) / 2;
      /* We append the background arc */
      svg.append('path')
        .attr('class', 'bg-arc')
        .attr('d', function() {
          arc.radius(radius);
          var points = d3.range(0, 50);
          radians.domain([0, points.length - 1]);
          return arc(points);
        })
        .attr('transform', function(d) { return 'translate('+(options.width / 2)+', '+(options.height / 2)+')'; });
      /* We append the foreground arc */
      var percentageScale = d3.scale.linear()
        .range([- 3 * Math.PI / 4, 3 * Math.PI / 4])
        .domain([0, 100]);
      radians.range([percentageScale(0), percentageScale(options.series[0].values[0].y)]);
      svg.append('path')
        .attr('class', 'fg-arc')
        .attr('d', function() {
          arc.radius(radius);
          var points = d3.range(0, 50);
          radians.domain([0, points.length - 1]);
          return arc(points);
        })
        .attr('transform', function(d) { return 'translate('+(options.width / 2)+', '+(options.height / 2)+')'; });
    }
    /* Only text */
    else {
      var verticalOffset = -30;
      var numberFormat = d3.format(',');
      var mainText = svg.append('g')
        .append('text')
        .attr('class', '')
        .attr('transform', function(d) { return 'translate('+(options.width / 2)+', '+(options.height / 2 + verticalOffset)+')'; })
        .attr('dy', '.3em')
        .style('text-anchor', 'middle');

      mainText.append('tspan')
        .attr('class', 'value big')
        .text(numberFormat(Math.round(options.series[0].values[0].y)));

      mainText.append('tspan')
        .attr('class', 'unit big')
        .text(' '+options.series[0].unit);

      var secondaryText = svg.append('g')
          .append('text')
          .attr('class', 'value')
          .attr('transform', function(d) { return 'translate('+(options.width / 2)+', '+(options.height + verticalOffset)+')'; })
          .style('text-anchor', 'middle');

      secondaryText.append('tspan')
        .attr('class', 'value')
        .text(numberFormat(Math.round(options.series[1].values[0].y)));//Math.round(options.series[0].values[0].y));

      secondaryText.append('tspan')
        .attr('class', 'unit')
        .text(' '+options.series[1].unit);

      var secondaryTextHeight = secondaryText[0][0].getBoundingClientRect().height;

      var label = svg.append('g')
          .append('text')
          .attr('class', 'label')
          .attr('transform', function(d) { return 'translate('+(options.width / 2)+', '+(options.height - secondaryTextHeight + verticalOffset)+')'; })
          .style('text-anchor', 'middle')
          .text(options.series[1].label);
    }
  };

  var pie = function(configuration) {
    var ret = setDefaults(configuration);
    if(ret === -1) { return; }
    /* We define the radius, the padding and the colours used */
    var padding = 25;
    var legendHeight = 5;
    var radius = Math.min(options.width - padding, options.height - padding - legendHeight) / 2;
    var color = d3.scale.ordinal()
      .range(d3.range(options.colorCount));
    /* We define the pie elements */
    var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius-18);
    var pie = d3.layout.pie()
      .value(function(d) { return d.y; });
    /* We create the svg elements */
    var svg = options.el.append('svg')
      .attr('class', 'pie-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight);
    var g = svg.append('g')
        .attr('transform', 'translate('+(options.width / 2)+','+(options.height / 2 - legendHeight)+')');
    var pie = g.selectAll('.arc')
      .data(pie(options.series[0].values))
      .enter().append('g')
        .attr('class', 'arc');
    pie.append('path')
      .attr('d', arc)
      .attr('class', function(d) { return 'cat-'+color(d.data.x); });
    var total = options.series[0].values.reduce(function(ret, d) { return ret+d.y; }, 0);
    pie.append('text')
      .attr('class', 'label')
      .attr('transform', function(d) {
        /* To compute the position of the labels we use a cosinus for the x,
           and a sinus for the y */
        var centroid = arc.centroid(d);
        var hypotenuse = Math.sqrt(centroid[0] * centroid[0] + centroid[1] * centroid[1]);
        var adjacent = centroid[0];
        var opposite = centroid[1];
        var labelRadius = radius + 6;
        return 'translate('+(labelRadius * adjacent / hypotenuse)+', '+(labelRadius * opposite / hypotenuse)+')';
      })
      .attr('dy', '.35em')
      .attr('text-anchor', function(d) {
        return (d.endAngle + d.startAngle)/2 > Math.PI ? 'end' : 'start';
      })
      .text(function(d) { return Math.round(d.data.y / total * 100)+'%'; });
    /* We finally append the legend */
    var radius = 3;
    var legend = svg.append('g')
      .attr('class', 'legend')
      .attr('height', legendHeight)
      .attr('width', options.width)
      .selectAll('g')
      .data(options.series[0].values)
      .enter().append('g');
    legend
      .append('text')
      .attr('dy', '0.35em')
      .text(function(d) { return d.x; })
      .attr('transform', function(d, i) {
        var offset = 15;
        if(i >= 0) {
          // var previousItem = this.parentElement.parentElement.childNodes[i - 1].querySelector('text'),
          //     previousItemWidth = previousItem.getBBox().width,
          //     previousItemOffset = parseFloat(previousItem.getAttribute('transform').split(',')[0].split('(')[1]),
          //     margin = 12;
          // offset = previousItemWidth + previousItemOffset + margin + 3 * radius;
          offset = offset * i;
        }
        return 'translate(6, '+offset+')';
      });
    legend
      .append('circle')
      .attr('cx', 0)
      .attr('cy', function(d, i) {
        var offset = 15;
        if(i >= 0) {
          // var previousItem = this.parentElement.parentElement.childNodes[i - 1].querySelector('text'),
          //     previousItemWidth = previousItem.getBBox().width,
          //     previousItemOffset = parseFloat(previousItem.getAttribute('transform').split(',')[0].split('(')[1]),
          //     margin = 12;
          // offset = previousItemWidth + previousItemOffset + margin + 3;
          offset = offset * i;
        }
        return offset;
      })
      .attr('r', radius)
      .attr('class', function(d) { return 'cat-'+color(d.x); });
    svg.select('.legend')
      .attr('transform', function() {
        var width = this.getBBox().width,
            offset = (options.width - width) / 2,
            heightLegend = this.getBBox().height;

        return 'translate('+((options.width / 2) - (width / 2) + 3)+','+((options.height / 2) - (heightLegend / 2))+')';
      });
  };

  var line = function(configuration) {
    var ret = setDefaults(configuration);
    if(ret === -1) { return; }
    /* Padding to avoid lines and points to be cut on thr right edge */
    var paddingTop = options.yAxis.showLabel ? 15 : 0;
    var rightPadding = 2;
    var legendHeight = 25;
    /* We define the scales and axis */
    var x;
    if(options.xAxis.timeserie) {
      x = d3.time.scale()
        .range([0, options.innerWidth - options.yAxis.width - rightPadding]);
    }
    else {
      x = d3.scale.linear()
        .range([0, options.innerWidth - options.yAxis.width - rightPadding]);
    }
    var y = d3.scale.linear()
      .range([options.innerHeight - options.xAxis.height - legendHeight, paddingTop]);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
    /* We add the ticksFormat callback if exists */
    if(options.xAxis.tickFormat) {
      xAxis.tickFormat(options.xAxis.tickFormat);
    }
    /* We format the ticks of the axis */
    else if(options.xAxis.timeserie) {
      xAxis.tickFormat(d3.time.format('%Y'));
    }
    else {
      xAxis.tickFormat(d3.format('d'));
    }
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');
    /* We limit the number of ticks */
    if(options.xAxis.tickCount) {
      xAxis.ticks(options.xAxis.tickCount);
    }
    if(options.yAxis.tickCount) {
      yAxis.ticks(options.yAxis.tickCount);
    }
    /* We generate the svg container */
    var svg = options.el.append('svg')
      .attr('class', 'line-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight)
      .append('g')
        .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');
    /* We create the domains */
    x.domain(d3.extent(options.series[0].values.map(function(d) { return d.x; })));
    var yFactor, yAxisUnit;
    y.domain([+Infinity, -Infinity]);
    for(var i = 0, j = options.series.length; i < j; i++) {
      var yDomain = d3.extent(options.series[i].values.map(function(d) { return d.y; }));
      var offset = (yDomain[1] !== yDomain[0]) ? (yDomain[1] - yDomain[0]) * 0.1 : yDomain[0] * 0.1;
      /* We inscrease the y domain by 20% (10 up, 10 down) so we could see all the values */
      yDomain[0] = (yDomain[0] - offset < y.domain()[0]) ? yDomain[0] - offset : y.domain()[0];
      yDomain[1] = (yDomain[1] + offset > y.domain()[1]) ? yDomain[1] + offset : y.domain()[1];
      y.domain(yDomain);
      /* The ticks value will be divided by a factor to gain horizontal space */
      yFactor = getFactor(d3.median(options.series[i].values.map(function(d) { return d.y; })));
      /* We store the unit */
      yAxisUnit = options.series[i].unit || '';
    }
    if(yFactor > 0) {
      yAxis.tickFormat(function(d) {
        return d / (1000 * yFactor);
      });
    }
    /* We append the axis */
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate('+options.yAxis.width+',' + (options.innerHeight - options.xAxis.height - legendHeight) + ')')
      .call(xAxis);
    var g = svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+options.yAxis.width+', 0)')
      .call(yAxis);
    if(options.yAxis.showLabel) {
      g
        .append('text')
        .attr('y', 0)
        .attr('dy', '.71em')
        .attr('transform', 'translate(-'+options.yAxis.width+', 0)')
        .attr('class', 'label')
        .style('text-anchor', 'start')
        .text(function() {
          if(yFactor === 3)      { return 'G'+yAxisUnit; }
          else if(yFactor === 2) { return 'M'+yAxisUnit; }
          else if(yFactor === 1) { return 'k'+yAxisUnit; }
          else { return yAxisUnit; }
      });
    }
    /* We append the grid, if active */
    if(options.yAxis.showGrid) {
      var yGrid = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickSize(-options.width + options.yAxis.width, 0, 0)
        .tickFormat('');
      if(options.yAxis.tickCount) { yGrid.ticks(options.yAxis.tickCount); }
      svg.append('g')
        .attr('class', 'ruler y')
        .call(yGrid)
        .attr('transform', 'translate('+options.yAxis.width+', 0)');
    }
    /* For each serie, we append the elements */
    for(var i = 0, j = options.series.length; i < j; i++) {
      appendLines(svg, x, y, options.series[i].values, 0, 0, 'cat-'+i);
    }
    generateTrail(svg);
    /* We finally append the legend */
    var legendData = [];
    for(var i = 0, j = options.series.length; i < j; i++) {
      legendData.push(options.series[i].label);
    }
    var legend = svg.append('g')
      .attr('class', 'legend')
      .attr('height', legendHeight)
      .attr('width', options.width)
      .selectAll('g')
      .data(legendData)
      .enter().append('g');
    legend
      .append('text')
      .attr('dy', '0.35em')
      .text(function(d) { return d; })
      .attr('transform', function(d, i) {
        var offset = 10;
        if(i > 0) {
          var previousItem = this.parentElement.parentElement.childNodes[i - 1].querySelector('text'),
              previousItemWidth = previousItem.getBBox().width,
              previousItemOffset = parseFloat(previousItem.getAttribute('transform').split(',')[0].split('(')[1]),
              margin = 12;
          offset = previousItemWidth + previousItemOffset + margin + offset;
        }
        return 'translate('+offset+', 0)';
      });
    legend
      .append('svg:line')
      .attr('x1', function(d, i) {
        var offset;
        if(i > 0) {
          var previousItem = this.parentElement.parentElement.childNodes[i - 1].querySelector('text'),
              previousItemWidth = previousItem.getBBox().width,
              previousItemOffset = parseFloat(previousItem.getAttribute('transform').split(',')[0].split('(')[1]),
              margin = 12;
          offset = previousItemWidth + previousItemOffset + margin;
        }
        return offset;
      })
      .attr('x2', function(d, i) {
        var offset = 5;
        if(i > 0) {
          var previousItem = this.parentElement.parentElement.childNodes[i - 1].querySelector('text'),
              previousItemWidth = previousItem.getBBox().width,
              previousItemOffset = parseFloat(previousItem.getAttribute('transform').split(',')[0].split('(')[1]),
              margin = 12;
          offset = previousItemWidth + previousItemOffset + margin + offset;
        }
        return offset;
      })
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('class', function(d, i) { return 'cat-'+i; });
    svg.select('.legend')
      .attr('transform', function() {
        var width = this.getBBox().width,
            offset = (options.width - width) / 2;
        return 'translate('+offset+','+(options.height - legendHeight + 15)+')';
      });
  };

  var bar = function(configuration) {
    var ret = setDefaults(configuration);
    if(ret === -1) { return; }
    /* We define the scales and axis */
    var paddingTop = options.yAxis.showLabel ? 15 : 0;
    var x = d3.scale.ordinal()
      .rangeBands([0, options.innerWidth - options.yAxis.width], 0.1, 0);
    var y = d3.scale.linear()
      .range([options.innerHeight - options.xAxis.height, paddingTop]);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
    /* We add the ticksFormat callback if exists */
    if(options.xAxis.tickFormat) {
      xAxis.tickFormat(options.xAxis.tickFormat);
    }
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');
    if(options.yAxis.tickCount) {
      yAxis.ticks(options.yAxis.tickCount);
    }
    /* We generate the svg container */
    var svg = options.el.append('svg')
      .attr('class', 'bar-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight)
      .append('g')
        .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');
    /* We create the domains */
    x.domain(options.series[0].values.map(function(d) { return d.x; }));
    var yFactor, yAxisUnit;
    var yDomain = d3.extent(options.series[0].values.map(function(d) { return d.y; }));
    /* We inscrease the y domain by 20% (10 up, 10 down) so we could see all the values */
    yDomain[0] = yDomain[0] - (yDomain[1] - yDomain[0]) * 0.1;
    yDomain[1] = yDomain[1] + (yDomain[1] - yDomain[0]) * 0.1;
    y.domain(yDomain);
    /* We compute the number of time we can divide the ticks by 1000 */
    yFactor = getFactor(d3.median(options.series[0].values.map(function(d) { return d.y; })));
    /* We store the unit */
    yAxisUnit = options.series[0].unit;
    /* We format the ticks of the axis */
    if(yFactor > 0) {
      yAxis.tickFormat(function(d) {
        return d / Math.pow(1000, yFactor);
      });
    }
    /* We append the axis */
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate('+options.yAxis.width+',' + (options.innerHeight - options.xAxis.height) + ')')
      .call(xAxis);
    var gY = svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+options.yAxis.width+', 0)')
      .call(yAxis)
      .append('text');
    if(options.yAxis.showLabel) {
      gY
        .attr('y', 0)
        .attr('transform', 'translate(-'+options.yAxis.width+', 0)')
        .attr('dy', '.71em')
        .style('text-anchor', 'start')
        .attr('class', 'label')
        .text(function() {
          if(yFactor === 3)      { return 'G'+yAxisUnit; }
          else if(yFactor === 2) { return 'M'+yAxisUnit; }
          else if(yFactor === 1) { return 'k'+yAxisUnit; }
          else { return yAxisUnit; }
        });
    }
    /* We append the grid, if active */
    if(options.yAxis.showGrid) {
      var yGrid = d3.svg.axis()
          .scale(y)
          .orient('left')
          .tickSize(-options.width + options.yAxis.width, 0, 0)
          .tickFormat('');
      if(options.yAxis.tickCount) { yGrid.ticks(options.yAxis.tickCount); }
      svg.append('g')
        .attr('class', 'ruler y')
        .call(yGrid)
        .attr('transform', 'translate('+options.yAxis.width+', 0)');
    }
    /* For each serie, we append the elements */
    appendBars(svg, x, y, options.series[0].values);
    generateTrail(svg);
  };

  var compareBar = function(configuration) {
    var ret = setDefaults(configuration);
    if(ret === -1) { return; }
    /* We define the scales and axis */
    var paddingTop = options.yAxis.showLabel ? 15 : 0;
    var x = d3.scale.ordinal()
      .rangeBands([0, options.innerWidth - options.yAxis.width], 0.2, 0.5);
    var y = d3.scale.linear()
      .range([options.innerHeight - options.xAxis.height, paddingTop]);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
    /* We add the ticksFormat callback if exists */
    if(options.xAxis.tickFormat) {
      xAxis.tickFormat(options.xAxis.tickFormat);
    }
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');
    if(options.yAxis.tickCount) {
      yAxis.ticks(options.yAxis.tickCount);
    }
    /* We generate the svg container */
    var svg = options.el.append('svg')
      .attr('class', 'compare-bar-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight)
      .append('g')
        .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');
    /* We create the domains */
    x.domain([options.series[0].label].concat(options.series[1].label));
    var yFactor, yAxisUnit, yDomain = [0, 0];
    if(options.series[0].values[0].y > options.series[1].values[0].y) {
      yDomain = [options.series[1].values[0].y, options.series[0].values[0].y];
    }
    else {
      yDomain = [options.series[0].values[0].y, options.series[1].values[0].y];
    }
    /* We inscrease the y domain by 20% (10 up, 10 down) so we could see all the values */
    yDomain[0] = yDomain[0] - (yDomain[1] - yDomain[0]) * 0.1;
    yDomain[1] = yDomain[1] + (yDomain[1] - yDomain[0]) * 0.1;
    y.domain(yDomain);
    /* We compute the number of time we can divide the ticks by 1000 */
    yFactor = getFactor(yDomain[1]);
    /* We store the unit */
    yAxisUnit = options.series[0].unit;
    /* We format the ticks of the axis */
    if(yFactor > 0) {
      yAxis.tickFormat(function(d) {
        return d / Math.pow(1000, yFactor);
      });
    }
    /* We append the axis */
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate('+options.yAxis.width+',' + (options.innerHeight - options.xAxis.height) + ')')
      .call(xAxis);
    var gY = svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+options.yAxis.width+', 0)')
      .call(yAxis)
      .append('text');
    if(options.yAxis.showLabel) {
      gY
        .attr('y', 0)
        .attr('dy', '.71em')
        .attr('transform', 'translate(-'+options.yAxis.width+', 0)')
        .style('text-anchor', 'start')
        .attr('class', 'label')
        .text(function() {
          if(yFactor === 3)      { return 'G'+yAxisUnit; }
          else if(yFactor === 2) { return 'M'+yAxisUnit; }
          else if(yFactor === 1) { return 'k'+yAxisUnit; }
          else { return yAxisUnit; }
        });
    }
    /* We append the grid, if active */
    if(options.yAxis.showGrid) {
      var yGrid = d3.svg.axis()
          .scale(y)
          .orient('left')
          .tickSize(-options.width + options.yAxis.width, 0, 0)
          .tickFormat('');
      if(options.yAxis.tickCount) { yGrid.ticks(options.yAxis.tickCount); }
      svg.append('g')
        .attr('class', 'ruler y')
        .call(yGrid)
        .attr('transform', 'translate('+options.yAxis.width+', 0)');
    }
    /* For each serie, we append the elements */
    options.series[0].values[0].x = options.series[0].label;
    options.series[1].values[0].x = options.series[1].label;
    appendBars(svg, x, y, options.series[0].values, 'cat-1');
    appendBars(svg, x, y, options.series[1].values, 'cat-2');
    generateTrail(svg);
  };

  var barLine = function(configuration) {
    var ret = setDefaults(configuration);
    if(ret === -1) { return; }
    /* We define the scales and axis */
    var paddingTop = options.yAxis.showLabel ? 15 : 0;
    var x = d3.scale.ordinal()
      .rangeBands([0, options.innerWidth - options.yAxis.width * 2], 0.1, 0);
    var yBar = d3.scale.linear()
      .range([options.innerHeight - options.xAxis.height, paddingTop]);
    var yLine = d3.scale.linear()
      .range([options.innerHeight - options.xAxis.height, paddingTop]);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');
    /* We add the ticksFormat callback if exists */
    if(options.xAxis.tickFormat) {
      xAxis.tickFormat(options.xAxis.tickFormat);
    }
    var yBarAxis = d3.svg.axis()
      .scale(yBar)
      .orient('left');
    var yLineAxis = d3.svg.axis()
      .scale(yLine)
      .orient('right');
    if(options.yAxis.tickCount) {
      yBarAxis.ticks(options.yAxis.tickCount);
      yLineAxis.ticks(options.yAxis.tickCount);
    }
    /* We generate the svg container */
    var svg = options.el.append('svg')
      .attr('class', 'barline-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight)
      .append('g')
        .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');
    /* We create the domains */
    x.domain(options.series[0].values.map(function(d) { return d.x; }));
    var yBarFactor, yLineFactor, yBarAxisUnit, yLineAxisUnit;
    for(var i = 0, j = options.series.length; i < j; i++) {
      if(options.series[i].type === 'bars') {
        var yBarDomain = d3.extent(options.series[i].values.map(function(d) { return d.y; }));
        /* We inscrease the y domain by 20% (10 up, 10 down) so we could see all the values */
        yBarDomain[0] = yBarDomain[0] > 0 ? yBarDomain[0] - (yBarDomain[1] - yBarDomain[0]) * 0.1 : yBarDomain[0];
        yBarDomain[1] = yBarDomain[1] + (yBarDomain[1] - yBarDomain[0]) * 0.1;
        yBar.domain(yBarDomain);
        /* We compute the number of time we can divide the ticks by 1000 */
        yBarFactor = getFactor(d3.median(options.series[i].values.map(function(d) { return d.y; })));
        /* We store the unit */
        yBarAxisUnit = options.series[i].unit;
      }
      else if(options.series[i].type === 'lines') {
        var yLineDomain = d3.extent(options.series[i].values.map(function(d) { return d.y; }));
        var offset = (yLineDomain[1] !== yLineDomain[0]) ? (yLineDomain[1] - yLineDomain[0]) * 0.1 : yLineDomain[0] * 0.1;
        /* We inscrease the y domain by 20% (10 up, 10 down) so we could see all the values */
        yLineDomain[0] = yLineDomain[0] - offset;
        yLineDomain[1] = yLineDomain[1] + offset;
        yLine.domain(yLineDomain);
        /* We compute the number of time we can divide tre ticks by 1000 */
        yLineFactor = getFactor(d3.median(options.series[i].values.map(function(d) { return d.y; })));
        /* We store the unit */
        yLineAxisUnit = options.series[i].unit;
      }
    }
    /* We format the ticks of the axis */
    if(yBarFactor > 0) {
      yBarAxis.tickFormat(function(d) {
        return d / Math.pow(1000,yBarFactor);
      });
    }
    if(yLineFactor > 0) {
      yLineAxis.tickFormat(function(d) {
        return d / Math.pow(1000,yLineFactor);
      });
    }
    /* We append the axis */
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate('+options.yAxis.width+',' + (options.innerHeight - options.xAxis.height) + ')')
      .call(xAxis);
    var gY = svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+options.yAxis.width+', 0)')
      .call(yBarAxis)
      .append('text');
    if(options.yAxis.showLabel) {
      gY
        .attr('y', 0)
        .attr('dy', '.71em')
        .attr('transform', 'translate(-'+options.yAxis.width+', 0)')
        .style('text-anchor', 'start')
        .attr('class', 'label')
        .text(function() {
          if(yBarFactor === 3)      { return 'G'+yBarAxisUnit; }
          else if(yBarFactor === 2) { return 'M'+yBarAxisUnit; }
          else if(yBarFactor === 1) { return 'k'+yBarAxisUnit; }
          else { return yBarAxisUnit; }
        });
    }
    var gY2 = svg.append('g')
      .attr('class', 'y2 axis')
      .attr('transform', 'translate('+(options.innerWidth - options.yAxis.width)+', 0)')
      .call(yLineAxis)
      .append('text');
    if(options.yAxis.showLabel) {
      gY2
        .attr('y', 0)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .attr('transform', 'translate('+options.yAxis.width+', 0)')
        .attr('class', 'label')
        .text(function() {
          if(yLineFactor === 3)      { return 'G'+yLineAxisUnit; }
          else if(yLineFactor === 2) { return 'M'+yLineAxisUnit; }
          else if(yLineFactor === 1) { return 'k'+yLineAxisUnit; }
          else { return yLineAxisUnit; }
        });
    }
    /* We append the grid, if active */
    if(options.yAxis.showGrid) {
      var yGrid = d3.svg.axis()
          .scale(yBar)
          .orient('left')
          .tickSize(-options.width + 2 * options.yAxis.width, 0, 0)
          .tickFormat('');
      if(options.yAxis.tickCount) { yGrid.ticks(options.yAxis.tickCount); }
      svg.append('g')
        .attr('class', 'ruler y')
        .call(yGrid)
        .attr('transform', 'translate('+options.yAxis.width+', 0)');
    }
    /* For each serie, we append the elements */
    for(var i = 0, j = options.series.length; i < j; i++) {
      if(options.series[i].type === 'bars') {
        appendBars(svg, x, yBar, options.series[i].values);
      }
      else if(options.series[i].type === 'lines') {
        appendLines(svg, x, yLine, options.series[i].values, x.rangeBand() / 2);
      }
      else {
        console.warn('Unrecognized type of serie: '+options.series[i].type);
      }
    }
    generateTrail(svg);
  };

  var rank = function(configuration) {
    var ret = setDefaults(configuration);
    var data = options.series;

    /* We generate the svg container */
    var svg = options.el.append('svg')
      .attr('class', 'rank-chart')
      .attr('width', options.innerWidth)
      .attr('height', options.innerHeight)
      .append('g')
        .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');

    /* Containers width */
    var width = options.innerWidth;
    var rankW = (width * 16) / 100;
    var countryW = (width * 35) / 100;
    var rankValueW = (width * 38) / 100;

    /* Containers height */
    var rankValueH = 10;
    var textLineH = 20;

    /* Paddings */
    var paddingLeft = 15;
    var paddCountryLeft = paddingLeft + rankW;
    var paddRankValueLeft = paddCountryLeft + countryW;

    /* Rank */

    var x = d3.scale.linear()
      .range([0, rankValueW]);

    var allValues = _.union(data[0], data[1], data[2]);

    var maxValue = d3.max(allValues, function(d) {
      return d.value;
    });

    x.domain([0, maxValue]);

    if(data[0] && data[0].length) {
      var ranking = svg.append('g')
        .attr('id', 'ranking-top')
        .selectAll('g')
        .data(data[0])
        .enter()
        .append('g')
        .attr('class', function(d) {
          if(d.current) {
            return 'selected';
          }
        })
        .attr('transform', function(d, i){
          return 'translate(0,'+((i+1)*20)+')';
        });

      ranking.append('g')
        .attr('width', rankW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+(paddingLeft*2)+',0)')
        .append('text')
          .attr('class', 'text rank')
          .text(function(d){
            return d.rank;
          });

      ranking.append('g')
        .attr('width', countryW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+paddCountryLeft+',0)')
        .append('text')
          .attr('class', 'text country')
          .text(function(d){
            return d.name;
          });

      ranking.append('g')
        .attr('width', rankValueW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+paddRankValueLeft+',0)')
        .append('rect')
          .attr('transform', 'translate(0,-'+(rankValueH-1)+')')
          .attr('class', 'rank-value')
          .attr('height', rankValueH)
          .attr('width', 0)
          .transition().duration(500).ease('linear')
          .attr('width', function(d) {
            return x(d.value);
          });
    }

    /* Show middle positions */

    if(data[2] && data[2].length) {
      var topRankingBox = document.getElementById('ranking-top');
      var topRankingH = 0;
      var bottomPadding = 15;
      var bottomMargin = 30;

      if(topRankingBox) {
        topRankingH = topRankingBox.getBBox().height;
      }

      svg.append('g')
        .attr('transform', 'translate(0,'+(topRankingH + bottomPadding)+')')
        .append('line')
        .attr('class', 'bottom-line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', options.innerWidth)
        .attr('y2', 0);

      var rankingBottom = svg.append('g')
        .attr('id', 'ranking-middle')
        .attr('transform', 'translate(0,'+(topRankingH + bottomPadding)+')');

      var bottomRanking = rankingBottom.selectAll('g')
        .data(data[2])
        .enter().append('g')
        .attr('class', function(d) {
          if(d.current) {
            return 'selected';
          }
        })
        .attr('transform', function(d, i){
          return 'translate(0,'+((i+1)*20)+')';
        });

      bottomRanking.append('g')
        .attr('width', rankW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+(paddingLeft)+',0)')
        .append('text')
          .attr('class', 'text rank')
          .text(function(d){
            return d.rank;
          });

      bottomRanking.append('g')
        .attr('width', countryW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+paddCountryLeft+',0)')
        .append('text')
          .attr('class', 'text country')
          .text(function(d){
            return d.name;
          });

      bottomRanking.append('g')
        .attr('width', rankValueW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+paddRankValueLeft+',0)')
        .append('rect')
          .attr('transform', 'translate(0,-'+(rankValueH-1)+')')
          .attr('class', 'rank-value')
          .attr('height', rankValueH)
          .attr('width', 0)
          .transition().duration(500).ease('linear')
          .attr('width', function(d) {
            return x(d.value);
          });
    }

    /* Show last positions */

    if(data[1] && data[1].length) {
      var topRankingBox = document.getElementById('ranking-top');
      var middleRankingBox = document.getElementById('ranking-middle');
      var topRankingH = 0;
      var middleRankingH = 0;
      var bottomPadding = 15;
      var bottomMargin = 30;

      if(topRankingBox) {
        topRankingH = topRankingBox.getBBox().height;
      }

      if(middleRankingBox) {
        middleRankingH = middleRankingBox.getBBox().height;
        bottomPadding = bottomPadding * 2;
      }

      svg.append('g')
        .attr('transform', 'translate(0,'+(topRankingH + middleRankingH + bottomPadding)+')')
        .append('line')
        .attr('class', 'bottom-line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', options.innerWidth)
        .attr('y2', 0);

      var rankingBottom = svg.append('g')
        .attr('class', 'ranking-bottom')
        .attr('transform', 'translate(0,'+(topRankingH + middleRankingH + bottomPadding)+')');

      var bottomRanking = rankingBottom.selectAll('g')
        .data(data[1])
        .enter().append('g')
        .attr('class', function(d) {
          if(d.current) {
            return 'selected';
          }
        })
        .attr('transform', function(d, i){
          return 'translate(0,'+((i+1)*20)+')';
        });

      bottomRanking.append('g')
        .attr('width', rankW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+(paddingLeft)+',0)')
        .append('text')
          .attr('class', 'text rank')
          .text(function(d){
            return d.rank;
          });

      bottomRanking.append('g')
        .attr('width', countryW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+paddCountryLeft+',0)')
        .append('text')
          .attr('class', 'text country')
          .text(function(d){
            return d.name;
          });

      bottomRanking.append('g')
        .attr('width', rankValueW)
        .attr('height', textLineH)
        .attr('transform', 'translate('+paddRankValueLeft+',0)')
        .append('rect')
          .attr('transform', 'translate(0,-'+(rankValueH-1)+')')
          .attr('class', 'rank-value')
          .attr('height', rankValueH)
          .attr('width', 0)
          .transition().duration(500).ease('linear')
          .attr('width', function(d) {
            return x(d.value);
          });
    }
  };

  return function(configuration) {
    if(!configuration) { return; }
    if(configuration.type === 'BarLine') {
      return barLine(configuration);
    }
    else if(configuration.type === 'Line') {
      return line(configuration);
    }
    else if(configuration.type === 'Bar') {
      return bar(configuration);
    }
    else if(configuration.type === 'Compare-Bar') {
      return compareBar(configuration);
    }
    else if(configuration.type === 'Pie') {
      return pie(configuration);
    }
    else if(configuration.type === 'Textual') {
      return textual(configuration);
    }
    else if(configuration.type === 'Rank') {
      return rank(configuration);
    }
    else {
      console.log('Unrecognized type of chart:', configuration.type);
    }
  };

});
