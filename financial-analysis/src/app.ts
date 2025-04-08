import express, { Application, Request, Response, NextFunction } from 'express';
import router from './api/routes';
import { FinancialError, handleApiError } from './utils/error-handling';
import { appConfig } from './config/app-config';
import { securityMiddleware, errorLoggingMiddleware } from './middleware/security';
import session from 'express-session';
import { SessionManager } from './services/session/SessionManager';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import healthRouter from './api/health';

const app: Application = express();

// Initialize session manager
const sessionManager = new SessionManager();

// Add session middleware before other middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

// Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());
app.use(securityMiddleware);
app.use(express.static('public'));

// Add before other routes
app.use('/api', healthRouter);

// API Routes
app.use('/api', router);

// Add error logging middleware before error handler
app.use(errorLoggingMiddleware);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
    if (err instanceof FinancialError) {
        return res.status(400).json({
            error: err.message,
            code: err.code,
            details: err.details
        });
    }
    
    const error = handleApiError(err);
    res.status(500).json({
        error: error.message,
        code: error.code
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`${appConfig.appName} running on port ${port}`);
});

export default app;