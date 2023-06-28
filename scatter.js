// Load the correlation matrix data
d3.csv('/data/correlation_matrix.csv').then(function(data) {
    // Convert the correlation values to numbers
    data.forEach(function(d) {
      Object.keys(d).forEach(function(key) {
        if (key !== '') {
          d[key] = +d[key];
        }
      });
    });
  
    // Set up the SVG container
    var svg = d3.select('#chart6')
      .append('svg')
      .attr('width', 800)
      .attr('height', 600);
  
    // Define scales and axes
    var xScale = d3.scaleBand()
      .domain(data.columns.slice(1))
      .range([50, 750])
      .padding(0.1);
  
    var yScale = d3.scaleBand()
      .domain(data.columns.slice(1))
      .range([550, 50])
      .padding(0.1);
  
    var colorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(['red', 'white', 'green']);
  
    // Draw the scatter plot
    svg.selectAll('circle')
      .data(data)
      .enter()
      .selectAll('circle')
      .data(function(d) {
        return data.columns.slice(1).map(function(key) {
          return { asset1: d[''], asset2: key, correlation: d[key] };
        });
      })
      .enter()
      .append('circle')
      .attr('cx', function(d) { return xScale(d.asset1) + xScale.bandwidth() / 2; })
      .attr('cy', function(d) { return yScale(d.asset2) + yScale.bandwidth() / 2; })
      .attr('r', 5)
      .attr('fill', function(d) { return colorScale(d.correlation); })
      .on('mouseover', function() {
        d3.select(this).attr('r', 8); // Increase circle radius on mouseover
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5); // Restore circle radius on mouseout
      });
  
    // Add correlation labels
    svg.selectAll('.correlation-label')
      .data(data)
      .enter()
      .selectAll('.correlation-label')
      .data(function(d) {
        return data.columns.slice(1).map(function(key) {
          return { asset1: d[''], asset2: key, correlation: d[key] };
        });
      })
      .enter()
      .append('text')
      .attr('class', 'correlation-label')
      .attr('x', function(d) { return xScale(d.asset1) + xScale.bandwidth() / 2; })
      .attr('y', function(d) { return yScale(d.asset2) + yScale.bandwidth() / 2 - 8; })
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .style('font-family', 'Arial')
      .style('font-size', '10px')
      .text(function(d) { return d.correlation.toFixed(2); });
  
    // Add x-axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, 550)')
      .call(d3.axisBottom(xScale));
  
    // Add y-axis
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(50, 0)')
      .call(d3.axisLeft(yScale));
  
    // Add chart title
    svg.append('text')
      .attr('x', 400)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Arial')
      .style('font-size', '16px')
      .text('Asset Correlation Matrix');
  });
  