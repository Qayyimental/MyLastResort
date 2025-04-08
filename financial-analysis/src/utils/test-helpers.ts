import { Transaction } from '../models/transaction';

export class TestHelper {
    static createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
        return {
            id: `test-${Date.now()}`,
            date: new Date(),
            amount: 100,
            description: 'Test Transaction',
            category: 'TEST',
            accountingStandard: 'IFRS',
            debitAccountId: 'TEST-DEBIT',
            creditAccountId: 'TEST-CREDIT',
            status: 'pending',
            ...overrides
        };
    }

    static createMockTransactions(count: number): Transaction[] {
        return Array.from({ length: count }, (_, i) => 
            this.createMockTransaction({ id: `test-${i}` }));
    }

    static validateTransactionIntegrity(transaction: Transaction): boolean {
        return (
            transaction.amount > 0 &&
            transaction.debitAccountId !== transaction.creditAccountId &&
            ['pending', 'completed', 'failed'].includes(transaction.status)
        );
    }
}
