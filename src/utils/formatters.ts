export function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US');
}

export function formatNumber(value: number): string {
    return value.toLocaleString();
}