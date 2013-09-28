// Helpers... 
function buildHistogram(opts, highlightScore) {
  var scores = _.pluck(opts, 'score'),
      formatCount = d3.format(",.0f"),
      margin = {top: 10, right: 10, bottom: 30, left: 10},
      width = 180 - margin.left - margin.right,
      height = 80 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain([500, 1200])
      .range([0, width + margin.left + margin.right]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram()
      .bins(160)
      (scores);

  var binIndex = (function findInBins(bins, value) {
      var index = 0;
      _.each(bins, function(bin, i) {
        if( _.contains(bin, value) ) {
          index = i;
        }
      });
      return index;
  })(data, highlightScore);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(4)
      .tickSize(4)
      .orient("bottom")

  var svg = d3.select(".hist")
      .append("svg")
      .attr("width", 240)
      .attr("height", 80)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
      .data(data)
      .enter().append("g")
      .attr("class", function(d, i) { return i === binIndex ? "bar contains-value" : "bar"; })
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      //.attr("width", x(data[0].dx))
      .attr("width", 1)
      .attr("height", function(d) { return height - y(d.y); });

  bar.append("text")
      .attr("dy", ".55em")
      .attr("y", 6)
      //.attr("x", x(data[0].dx) / 2)
      .attr("text-anchor", "middle")
      //.text(function(d) { return d.y; });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
};

function buildGraph(opts) {
  var data = opts.data,
      el = opts.el,
      margin = {top: 30, right: 45, bottom: 30, left: 45}, 
      width = 280 - margin.left - margin.right,
      height = 120 - margin.top - margin.bottom;

  // convert to a timestamp so we can use a time scale
  data.forEach(function(d) {
    d.year = (new Date(d.year)).getTime();
  });

  var x = d3.time.scale()
            .domain([data[0].year, data[data.length-1].year])
            .range([0, width]);
      y = d3.scale.linear()
            .domain([d3.min(data, function(d) { return +d.pop }), d3.max(data, function(d) { return +d.pop; })])
            .range([height, 0]),

      xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format('%y'))
        .tickSize(3)
        .ticks(data.length),

      yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .tickSize(3)
        .tickValues(y.domain()),

      area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.year); })
        .y0(height)
        .y1(function(d) { return y(d.pop); }),

      valueline = d3.svg.line()
        .x(function(d) { return x(d.year); }) 
        .y(function(d) { return y(d.pop); }),

      svg = d3.select('.graph')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add the clip path.
  svg.append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  // Add the area path.
  // http://bl.ocks.org/mbostock/1166403
  /*svg.append("path")
      .attr("class", "area")
      .attr("clip-path", "url(#clip)")
      .attr("d", area(data));
  */

  svg.append("path") // Add the valueline path.
      .attr("d", valueline(data));

  svg.append("g") // Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
};

function suffixNumber(number) {
  var lastDigit;

  if( typeof number != 'string' ) {
    lastDigit = (function(n) {
      var tmp = n.toString();
      return +tmp[lastDigit.length-1];
    })(number);
  }
  else {
    lastDigit = number[number.length - 1];
  }

  if( +lastDigit === 1 ) {
    suffix = 'st';
  }
  if( +lastDigit === 2 ) {
    suffix = 'nd';
  }
  if( +lastDigit === 3 ) {
    suffix = 'rd';
  }
  if( _.contains([0,4,5,6,7,8,9], +lastDigit) ) {
    suffix = 'th';
  }

  return number + '<sup>' + suffix + '</sup>';
}

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
};

function styleFeature(feature, type) {

  var metric;
  if( type === 'population' ) {
    metric = feature.properties.data && feature.properties.data.density ? 
        feature.properties.data.density : 0;
  }
  if( type === 'seifa' ) {
    metric = feature.properties.seifa && feature.properties.seifa.score ? 
        feature.properties.seifa.score : 0;
  }

  return {
      fillColor: getColor(metric),
      weight: 1,
      opacity: 0.7,
      color: '#888',
      dashArray: '3',
      fillOpacity: 0.7
  };
};