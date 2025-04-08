interface IncomeStatement {
    revenue: number;
    costOfGoodsSold: number;
    grossProfit: number;
    operatingExpenses: number;
    operatingIncome: number;
    otherIncome: number;
    netIncome: number;
}

class IncomeStatementCalculator {
    private statement: IncomeStatement;

    constructor(revenue: number, costOfGoodsSold: number, operatingExpenses: number, otherIncome: number) {
        this.statement = {
            revenue,
            costOfGoodsSold,
            grossProfit: 0,
            operatingExpenses,
            operatingIncome: 0,
            otherIncome,
            netIncome: 0
        };
    }

    calculateGrossProfit(): number {
        this.statement.grossProfit = this.statement.revenue - this.statement.costOfGoodsSold;
        return this.statement.grossProfit;
    }

    calculateOperatingIncome(): number {
        this.statement.operatingIncome = this.statement.grossProfit - this.statement.operatingExpenses;
        return this.statement.operatingIncome;
    }

    calculateNetIncome(): number {
        this.statement.netIncome = this.statement.operatingIncome + this.statement.otherIncome;
        return this.statement.netIncome;
    }

    getStatement(): IncomeStatement {
        return this.statement;
    }
}

export default IncomeStatementCalculator;