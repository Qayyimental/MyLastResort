export interface ForecastData {
  date: Date;
  value: number;
  confidence: number;
}

export class FinancialForecast {
  private data: ForecastData[];

  constructor() {
    this.data = [];
  }

  public addForecastPoint(point: ForecastData): void {
    this.data.push(point);
  }

  public getForecast(): ForecastData[] {
    return [...this.data];
  }

  public calculateTrend(): number {
    if (this.data.length < 2) return 0;
    
    const firstPoint = this.data[0];
    const lastPoint = this.data[this.data.length - 1];
    
    return (lastPoint.value - firstPoint.value) / this.data.length;
  }
}