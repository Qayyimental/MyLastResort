export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  growthRate: number;
  monthOverMonthChange: {
    revenue: number;
    expenses: number;
    profit: number;
  };
}

export interface FinancialForecast {
  predictions: Array<{
    date: string;
    value: number;
    confidenceInterval: [number, number];
  }>;
  accuracy: number;
  trend: 'up' | 'down' | 'stable';
}
