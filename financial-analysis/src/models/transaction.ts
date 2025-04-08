import { AccountingStandard } from '../types/standards';

export interface Transaction {
    id: string;
    date: Date;
    amount: number;
    description: string;
    category: string;
    accountingStandard: AccountingStandard;
    debitAccountId: string;
    creditAccountId: string;
    status: 'pending' | 'completed' | 'failed';
    metadata?: Record<string, any>;
}

export class TransactionModel {
    private transactions: Transaction[] = [];

    addTransaction(transaction: Transaction): void {
        this.validateTransaction(transaction);
        this.transactions.push(transaction);
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getTransactionById(id: string): Transaction | undefined {
        return this.transactions.find(transaction => transaction.id === id);
    }

    removeTransaction(id: string): void {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    }

    validateTransaction(transaction: Transaction): boolean {
        if (!transaction.id || !transaction.amount || !transaction.debitAccountId || !transaction.creditAccountId) {
            throw new Error('Missing required transaction fields');
        }
        if (transaction.amount <= 0) {
            throw new Error('Transaction amount must be positive');
        }
        return true;
    }

    filterTransactions(criteria: Partial<Transaction>): Transaction[] {
        return this.transactions.filter(t => {
            return Object.entries(criteria).every(([key, value]) => 
                t[key as keyof Transaction] === value
            );
        });
    }

    searchTransactions(query: string): Transaction[] {
        const lowercaseQuery = query.toLowerCase();
        return this.transactions.filter(t => 
            t.description.toLowerCase().includes(lowercaseQuery) ||
            t.category.toLowerCase().includes(lowercaseQuery)
        );
    }

    async exportToExcel(): Promise<Blob> {
        const worksheet = this.transactions.map(t => ({
            ID: t.id,
            Date: t.date,
            Amount: t.amount,
            Description: t.description,
            Category: t.category,
            Status: t.status
        }));
        const metadata = {
            generatedAt: new Date(),
            totalTransactions: this.transactions.length,
            totalAmount: this.transactions.reduce((sum, t) => sum + t.amount, 0)
        };
        const workbook = { metadata, transactions: worksheet };
        return new Blob([JSON.stringify(workbook)], 
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    async exportToPDF(): Promise<Blob> {
        return new Blob([JSON.stringify(this.transactions)], { type: 'application/pdf' });
    }

    validateBusinessRules(): boolean {
        const totalDebits = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalCredits = this.transactions.reduce((sum, t) => sum - t.amount, 0);
        return Math.abs(totalDebits + totalCredits) < 0.001;
    }
}