export interface ChartData {
  labels: string[];
  values: number[];
  title?: string;
  color?: string;
}

export class Charts {
  static formatLineChartData(data: ChartData) {
    return {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.title || 'Financial Data',
          data: data.values,
          borderColor: data.color || '#4285f4',
          tension: 0.1
        }]
      }
    };
  }

  static formatBarChartData(data: ChartData) {
    return {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: data.title || 'Financial Data',
          data: data.values,
          backgroundColor: data.color || '#34a853',
        }]
      }
    };
  }

  static formatPieChartData(data: ChartData) {
    return {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.color ? [data.color] : [
            '#4285f4',
            '#34a853',
            '#fbbc05',
            '#ea4335'
          ]
        }]
      }
    };
  }
}