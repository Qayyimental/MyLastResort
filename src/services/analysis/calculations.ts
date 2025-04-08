// calculations.ts

export function calculateLiquidity(currentAssets: number, currentLiabilities: number): number {
    return currentAssets / currentLiabilities;
}

export function calculateProfitability(netIncome: number, totalRevenue: number): number {
    return (netIncome / totalRevenue) * 100;
}

export function calculateDebtRatio(totalLiabilities: number, totalAssets: number): number {
    return totalLiabilities / totalAssets;
}

export function calculateVariance(actual: number, expected: number): number {
    return actual - expected;
}