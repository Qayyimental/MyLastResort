import express from 'express';
import router from './api/routes';
import { FinancialError, handleApiError } from './utils/error-handling';
import { appConfig } from './config/app-config';

const app = express();

app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api', router);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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