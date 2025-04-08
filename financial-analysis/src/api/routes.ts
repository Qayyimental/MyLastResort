import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import { createLogger } from '../utils/logger';

// Temporary mock imports until components are implemented
const mockFinancial = {
  getIncomeStatement: (req: Request, res: Response) => res.json({}),
  getBalanceSheet: (req: Request, res: Response) => res.json({}),
  getCashFlowStatement: (req: Request, res: Response) => res.json({})
};

const mockAnalytics = {
  calculateRatios: (req: Request, res: Response) => res.json({}),
  forecastFinancials: (req: Request, res: Response) => res.json({})
};

const router = Router();
const logger = createLogger('api-routes');

// Security headers
router.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later' }
});

router.use(limiter);

// Request validation middleware
const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Add logging middleware
router.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`, { 
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Financial Statements Routes with validation
router.get('/financial/income-statement', 
    [body('period').isString(), validate],
    mockFinancial.getIncomeStatement
);
router.get('/financial/balance-sheet', validate, mockFinancial.getBalanceSheet);
router.get('/financial/cash-flow', validate, mockFinancial.getCashFlowStatement);

// Analytics Routes with validation
router.get('/analytics/ratios', validate, mockAnalytics.calculateRatios);
router.post('/analytics/forecast', 
    [
        body('data').isArray(),
        body('period').isString(),
        validate
    ],
    mockAnalytics.forecastFinancials
);

export default router;