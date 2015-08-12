function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}

var parseDate = d3.time.format("%b %Y").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

d3.csv("sp500.csv", type, function(error, data) {
  var margin = {top: 10, right: 0, bottom: 100, left: 0},
      margin2 = {top: 430, right: 10, bottom: 7, left: 0},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      height2 = 500 - margin2.top - margin2.bottom;

  var x = d3.time.scale().range([0, width]),
      x2 = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 10]),
      y2 = d3.scale.linear().range([height2, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      xAxis2 = d3.svg.axis().scale(x2).tickSize(-height2 - 7, 0).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).tickSize(-width, 0).orient("left");

  var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

  var line = d3.svg.line()
      .interpolate('monotone')
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.price); });

  var area2 = d3.svg.area()
      .x(function(d) { return x2(d.date); })
      .y0(height2)
      .y1(function(d) { return y2(d.price); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  var hoverOverlay = svg.append("g")
      .attr("class", "hoverOverlay")
      .attr("width", width)
      .attr("height", height)
      .style("display", "none");

  hoverOverlay.append("circle")
      .attr("r", 4.5);

  hoverOverlay.append("line").attr("class", "top-line");
  hoverOverlay.append("line").attr("class", "bottom-line");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .on("mouseover", function() {
        $('.tooltip').show();
        hoverOverlay.style("display", null);
      })
      .on("mouseout", function() {
        $('.tooltip').hide();
        hoverOverlay.style("display", "none");
      })
      .on("mousemove", mousemove);

  x.domain(d3.extent(data.map(function(d) { return d.date; })));
  y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text")
      .attr("y", -10)
      .attr("x", 5)
      .style("text-anchor", "start");

  context.append("rect")
      .attr("class", "background")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height2 + 7)
      .attr("width", width);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("transform", "translate(0," + 7 + ")")
      .attr("d", area2);

  context.append("g")
      .attr("class", "x axis2")
      .attr("transform", "translate(0," + (height2 + 7) + ")")
      .call(xAxis2)
    .selectAll("text")
      .attr("y", -15)
      .attr("x", 6)
      .style("text-anchor", "start");

  context.append("g")
      .attr("class", "x brush")
      .attr("transform", "translate(0," + 6 + ")")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);

  focus.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    hoverOverlay.select("circle").attr("transform", "translate(" + x(d.date) + "," + (y(d.price) + margin.top) + ")");

    var $tooltip = $('.tooltip');
    var left = x(d.date) - ($tooltip.width()/2),
        top = y(d.price) - $tooltip.height() - 20;
    if (top <= margin.top) { top = y(d.price) + $tooltip.height() - 10; }
    $tooltip.css({ left: left+"px", top: top+"px" });
    $tooltip.find('h4').text(d.price);

    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var formattedDate = d.date.getDate() + " " + monthNames[d.date.getMonth()]  + " " + d.date.getFullYear();
    $tooltip.find('h5').text(formattedDate);

    hoverOverlay.selectAll("line")
      .attr("x1", x(d.date))
      .attr("x2", x(d.date));

    hoverOverlay.select(".top-line")
      .attr("y1", 0)
      .attr("y2", y(d.price) + (margin.top/2));

    hoverOverlay.select(".bottom-line")
      .attr("y1", y(d.price) + (margin.top*1.5))
      .attr("y2", height);
  }

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".line").attr("d", line);
    focus.select(".x.axis").call(xAxis);
  }

});
