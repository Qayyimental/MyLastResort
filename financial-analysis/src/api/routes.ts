import { Router } from 'express';
import { getIncomeStatement, getBalanceSheet, getCashFlowStatement } from '../components/financial';
import { calculateRatios, forecastFinancials } from '../components/analytics';

const router = Router();

// Financial Statements Routes
router.get('/financial/income-statement', getIncomeStatement);
router.get('/financial/balance-sheet', getBalanceSheet);
router.get('/financial/cash-flow', getCashFlowStatement);

// Analytics Routes
router.get('/analytics/ratios', calculateRatios);
router.post('/analytics/forecast', forecastFinancials);

export default router;