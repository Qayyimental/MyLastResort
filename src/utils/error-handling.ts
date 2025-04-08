export class FinancialError extends Error {
    code: string;
    details: any;

    constructor(message: string, code: string, details?: any) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'FinancialError';
    }
}

export function handleApiError(error: any): FinancialError {
    if (error instanceof FinancialError) {
        return error;
    }

    return new FinancialError(
        error.message || 'An unexpected error occurred',
        'UNKNOWN_ERROR',
        error
    );
}

export function validateAmount(amount: number): boolean {
    if (isNaN(amount) || amount <= 0) {
        throw new FinancialError(
            'Invalid amount',
            'INVALID_AMOUNT',
            { value: amount }
        );
    }
    return true;
}
