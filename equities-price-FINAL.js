// Set the dimensions of the container element
const containerWidth = 1200; // Specify the desired width
const containerHeight = 600; // Specify the desired height

// Create the Lightweight Chart within the container element
const chart = LightweightCharts.createChart(
  document.getElementById("chart2"),
  {
    width: containerWidth,
    height: containerHeight,
    timeScale: {
      timeVisible: true,
      tickMarkFormatter: (time, tickMarkType, locale) => {
        const date = new Date(time);
        return date.toLocaleDateString(locale);
      },
    },
    crosshair: {
        mode: 0
    }
  }
);

const lineSeries = []; // Array to store multiple line series
const legendItems = []; // Array to store legend items

// Function to add a line series with custom color
const addLineSeries = (data, color, assetName) => {
  const series = chart.addLineSeries();
  series.setData(data);
  series.applyOptions({
    color: color,
    lineWidth: 2,
  });

  const legendItem = {
    series,
    label: assetName,
    color,
  };
  legendItems.push(legendItem);

  return series;
};

// Load data and add line series
Promise.all([
  d3.csv("/data/QQQ-price.csv"),
  d3.csv("/data/SPY-price.csv"),
]).then(([QQQData, SPYData]) => {
  const QQQTimeSeriesData = QQQData.map((d) => ({
    time: new Date(d.Date).getTime(),
    value: +d.Price,
  }));
  const QQQSeries = addLineSeries(QQQTimeSeriesData, "blue", "QQQ");
  lineSeries.push(QQQSeries);

  const SPYTimeSeriesData = SPYData.map((d) => ({
    time: new Date(d.Date).getTime(),
    value: +d.Price,
  }));
  const SPYSeries = addLineSeries(SPYTimeSeriesData, "green", "SPY");
  lineSeries.push(SPYSeries);

  // Create the legend
  const legendContainer = document.getElementById("legend");
  if (legendContainer) {
    legendItems.forEach((item) => {
      const legendItem = document.createElement("div");
      legendItem.classList.add("legend-item");
      legendItem.innerHTML = `
        <div class="legend-color" style="background-color: ${item.color};"></div>
        <div class="legend-label" style="color: ${item.color};">${item.label}</div>
      `;
      legendContainer.appendChild(legendItem);
    });
  }
});

// Adding a window resize event handler to resize the chart when
// the window size changes.
// Note: for more advanced examples (when the chart doesn't fill
// the entire window), you may need to use ResizeObserver ->
// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
window.addEventListener("resize", () => {
  chart.resize(containerWidth, containerHeight);
});
