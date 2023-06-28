
// Set the dimensions and margins of the chart
var margin = { top: 30, right: 200, bottom: 30, left: 60 };
var width = 1800 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

// Create an array to store the asset names
var assetNames = ["BTC-USD", "ETH-USD", "SPY"];

// Load the CSV files for price data
var promises = assetNames.map(function (asset) {
  return d3.csv("getter/FINAL/" + asset + "-price.csv"); // Update the file path accordingly
});

// Parse the date string into a Date object
var parseDate = d3.timeParse("%Y-%m-%d");

// Parse the CSV data
Promise.all(promises)
  .then(function (data) {
    // Format the data
    var formattedData = data.map(function (assetData, index) {
      return {
        name: assetNames[index],
        data: assetData.map(function (d) {
          return {
            date: parseDate(d.Date), // Adjust the property name according to your CSV header
            value: +d.Price, // Adjust the property name according to your CSV header
          };
        }),
      };
    });

    console.log(formattedData); // Log the formatted data for debugging

    // Create the SVG container
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .text("Price");

   // Set the color scale
var colorScale = d3
.scaleOrdinal()
.domain(assetNames)
.range(["orange", "green", "blue"]); // Replace with your desired color(s)

// Create the legend container
var legendContainer = d3.select("#legend");

// Create the legend items
var legendItems = legendContainer
.selectAll("div")
.data(assetNames)
.enter()
.append("div")
.attr("class", "legend-item");

// Add color rectangles to the legend items
legendItems
.append("span")
.attr("class", "legend-color")
.style("background-color", function (d) {
  return colorScale(d);
});

// Add labels to the legend items
legendItems
.append("span")
.attr("class", "legend-label")
.text(function (d) {
  return d;
});


    // Set the scales for x and y axes
    var xScale = d3
      .scaleTime()
      .domain(d3.extent(formattedData[0].data, function (d) {
        return d.date;
      }))
      .range([0, width]);

    // Calculate the max values for each asset
    var maxValues = formattedData.map(function (asset) {
      return d3.max(asset.data, function (d) {
        return d.value;
      });
    });

    // Set the yScale domain and range for BTC-USD
    var yScaleBTC = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData[0].data, function (d) {
        return d.value;
      })])
      .range([height, 0]);

    // Set the yScale domain and range for ETH-USD
    var yScaleETH = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData[1].data, function (d) {
        return d.value;
      })])
      .range([height, 0]);

    // Set the yScale domain and range for SPY
    var yScaleSPY = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData[2].data, function (d) {
        return d.value;
      })])
      .range([height, 0]);

    // Set the color scale
    var colorScale = d3
      .scaleOrdinal()
      .domain(assetNames)
      .range(["orange", "green", "blue"]); // Replace with your desired color(s)

    // Create a line generator for BTC-USD
    var lineBTC = d3
      .line()
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScaleBTC(d.value);
      });

    // Create a line generator for ETH-USD
    var lineETH = d3
      .line()
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScaleETH(d.value);
      });

    // Create a line generator for SPY
    var lineSPY = d3
      .line()
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScaleSPY(d.value);
      });

    // Draw the lines for BTC-USD
    svg
      .append("path")
      .datum(formattedData[0].data)
      .attr("class", "line")
      .attr("d", lineBTC)
      .style("stroke", colorScale(assetNames[0]))
      .style("fill", "none");

    // Draw the lines for ETH-USD
    svg
      .append("path")
      .datum(formattedData[1].data)
      .attr("class", "line")
      .attr("d", lineETH)
      .style("stroke", colorScale(assetNames[1]))
      .style("fill", "none");

    // Draw the lines for SPY
    svg
      .append("path")
      .datum(formattedData[2].data)
      .attr("class", "line")
      .attr("d", lineSPY)
      .style("stroke", colorScale(assetNames[2]))
      .style("fill", "none");

    // Add x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // Add y-axis for BTC-USD on the left side
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScaleBTC));

    // Add y-axis for ETH-USD on the right side
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + width + ", 0)")
      .style("stroke", colorScale(assetNames[1]))
      .call(d3.axisRight(yScaleETH));

    // Add y-axis for SPY on the right side
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(d3.axisRight(yScaleSPY).tickPadding(40).ticks(5).tickValues(yScaleSPY.ticks(5).concat(yScaleSPY.domain()))) // Adjust the number of ticks as needed
      .selectAll("text")
      .style("fill", "blue"); // Change the color for SPY tick labels
  })

  
  .catch(function (error) {
    console.log("Error loading CSV files:", error);
  });
