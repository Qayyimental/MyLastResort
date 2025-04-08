export interface CashFlowEntry {
  date: Date;
  amount: number;
  type: 'inflow' | 'outflow';
  category: string;
  description: string;
}

export class CashFlow {
  private entries: CashFlowEntry[];

  constructor() {
    this.entries = [];
  }

  public addEntry(entry: CashFlowEntry): void {
    this.entries.push(entry);
  }

  public getNetCashFlow(startDate?: Date, endDate?: Date): number {
    const filteredEntries = this.filterByDateRange(startDate, endDate);
    return filteredEntries.reduce((net, entry) => {
      return net + (entry.type === 'inflow' ? entry.amount : -entry.amount);
    }, 0);
  }

  public getCashInflows(startDate?: Date, endDate?: Date): CashFlowEntry[] {
    const filteredEntries = this.filterByDateRange(startDate, endDate);
    return filteredEntries.filter(entry => entry.type === 'inflow');
  }

  public getCashOutflows(startDate?: Date, endDate?: Date): CashFlowEntry[] {
    const filteredEntries = this.filterByDateRange(startDate, endDate);
    return filteredEntries.filter(entry => entry.type === 'outflow');
  }

  private filterByDateRange(startDate?: Date, endDate?: Date): CashFlowEntry[] {
    return this.entries.filter(entry => {
      if (startDate && entry.date < startDate) return false;
      if (endDate && entry.date > endDate) return false;
      return true;
    });
  }
}