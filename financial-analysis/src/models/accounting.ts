import { AccountingStandard } from '../types/standards';

export class FinancialAccount {
  id: string;
  name: string;
  balance: number;
  standard: AccountingStandard;

  constructor(id: string, name: string, standard: AccountingStandard = 'IFRS') {
    this.id = id;
    this.name = name;
    this.balance = 0;
    this.standard = standard;
  }

  updateBalance(amount: number): void {
    this.balance += amount;
  }
}

export class Transaction {
  date: Date;
  debitAccount: FinancialAccount;
  creditAccount: FinancialAccount;
  amount: number;
  description: string;

  constructor(debit: FinancialAccount, credit: FinancialAccount, amount: number, description: string) {
    this.date = new Date();
    this.debitAccount = debit;
    this.creditAccount = credit;
    this.amount = amount;
    this.description = description;
  }

  execute(): void {
    this.debitAccount.updateBalance(this.amount);
    this.creditAccount.updateBalance(-this.amount);
  }
}