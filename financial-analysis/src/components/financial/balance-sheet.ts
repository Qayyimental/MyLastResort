interface BalanceSheet {
    assets: {
        currentAssets: number;
        nonCurrentAssets: number;
    };
    liabilities: {
        currentLiabilities: number;
        nonCurrentLiabilities: number;
    };
    equity: number;
}

function calculateTotalAssets(balanceSheet: BalanceSheet): number {
    return balanceSheet.assets.currentAssets + balanceSheet.assets.nonCurrentAssets;
}

function calculateTotalLiabilities(balanceSheet: BalanceSheet): number {
    return balanceSheet.liabilities.currentLiabilities + balanceSheet.liabilities.nonCurrentLiabilities;
}

function calculateEquity(balanceSheet: BalanceSheet): number {
    return calculateTotalAssets(balanceSheet) - calculateTotalLiabilities(balanceSheet);
}

function generateBalanceSheet(data: any): BalanceSheet {
    // Logic to extract and calculate balance sheet data from provided data
    const balanceSheet: BalanceSheet = {
        assets: {
            currentAssets: data.currentAssets,
            nonCurrentAssets: data.nonCurrentAssets,
        },
        liabilities: {
            currentLiabilities: data.currentLiabilities,
            nonCurrentLiabilities: data.nonCurrentLiabilities,
        },
        equity: 0, // Will be calculated
    };

    balanceSheet.equity = calculateEquity(balanceSheet);
    return balanceSheet;
}

export { BalanceSheet, generateBalanceSheet };