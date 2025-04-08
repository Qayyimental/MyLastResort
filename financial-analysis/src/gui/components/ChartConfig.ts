import { ChartOptions } from 'chart.js';

export const defaultChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#000',
      bodyColor: '#666',
      borderColor: '#ddd',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [2],
        drawBorder: false
      }
    }
  }
};
