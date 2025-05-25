const { createChart } = require('lightweight-charts');
const axios = require('axios');

let currentSymbol = 'BTCUSDT';
let currentTimeframe = '1h';
let chart;
let candleSeries;

function initChart() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';
  
  chart = createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: {
      backgroundColor: '#131722',
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: { color: '#1e222d' },
      horzLines: { color: '#1e222d' }
    },
    crosshair: { mode: 0 },
    timeScale: {
      timeVisible: true,
      borderColor: '#2a2e39'
    }
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
  });

  loadChartData();
}

async function loadChartData() {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${currentSymbol}&interval=${currentTimeframe}&limit=1000`
    );
    
    const data = response.data.map(d => ({
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4])
    }));
    
    candleSeries.setData(data);
  } catch (error) {
    console.error('දත්ත ලබාගැනීමේ දෝෂයක්:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initChart();
  
  document.querySelectorAll('.symbol-item').forEach(item => {
    item.addEventListener('click', () => {
      currentSymbol = item.getAttribute('data-symbol');
      loadChartData();
    });
  });
  
  document.querySelectorAll('.timeframe-selector button').forEach(button => {
    button.addEventListener('click', () => {
      currentTimeframe = button.getAttribute('data-timeframe');
      loadChartData();
    });
  });
  
  window.addEventListener('resize', () => {
    if (chart) {
      chart.applyOptions({
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight
      });
    }
  });
});