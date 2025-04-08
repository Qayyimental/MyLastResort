import { Router } from 'express';
import { validateEnv } from '../utils/env-validator';
import { createLogger } from '../utils/logger';

const router = Router();
const logger = createLogger('health-check');

router.get('/health', async (req, res) => {
  try {
    // Check environment
    validateEnv();
    
    // Add other health checks here (database, services, etc.)
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
