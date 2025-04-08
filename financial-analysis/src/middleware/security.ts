import { Request, Response, NextFunction } from 'express';
import { sanitize } from 'xss';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createLogger } from '../utils/logger';

const logger = createLogger('security-middleware');

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }),
  (req: Request, res: Response, next: NextFunction) => {
    // Sanitize input
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitize(req.body[key]);
        }
      });
    }
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
  }
];

export const errorLoggingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  next(err);
};
