// ratios.ts

/**
 * Calculates the liquidity ratio.
 * @param currentAssets - Total current assets.
 * @param currentLiabilities - Total current liabilities.
 * @returns The liquidity ratio.
 */
export function calculateLiquidityRatio(currentAssets: number, currentLiabilities: number): number {
    if (currentLiabilities === 0) {
        throw new Error("Current liabilities cannot be zero.");
    }
    return currentAssets / currentLiabilities;
}

/**
 * Calculates the profitability ratio.
 * @param netIncome - Total net income.
 * @param revenue - Total revenue.
 * @returns The profitability ratio.
 */
export function calculateProfitabilityRatio(netIncome: number, revenue: number): number {
    if (revenue === 0) {
        throw new Error("Revenue cannot be zero.");
    }
    return netIncome / revenue;
}

/**
 * Calculates the debt ratio.
 * @param totalDebt - Total debt.
 * @param totalAssets - Total assets.
 * @returns The debt ratio.
 */
export function calculateDebtRatio(totalDebt: number, totalAssets: number): number {
    if (totalAssets === 0) {
        throw new Error("Total assets cannot be zero.");
    }
    return totalDebt / totalAssets;
}

/**
 * Performs variance analysis.
 * @param actual - Actual financial figure.
 * @param budgeted - Budgeted financial figure.
 * @returns The variance.
 */
export function calculateVariance(actual: number, budgeted: number): number {
    return actual - budgeted;
}