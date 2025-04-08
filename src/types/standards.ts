export type AccountingStandard = 'IFRS' | 'GAAP';

export interface AccountingConfiguration {
  defaultStandard: AccountingStandard;
  enableAutoReconciliation: boolean;
  fiscalYearStart: number; // Month (1-12)
  reportingCurrency: string;
}
