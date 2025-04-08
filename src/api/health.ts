import { Router } from 'express';
import { validateEnv } from '../utils/env-validator';
import { createLogger } from '../utils/logger';
import { existsSync } from 'fs';
import { getPlatformConfigPath } from '../utils/platform';

const router = Router();
const logger = createLogger('health-check');

async function performHealthCheck() {
  const checks = {
    environment: false,
    fileSystem: false,
    configuration: false
  };

  try {
    validateEnv();
    checks.environment = true;

    const configPath = getPlatformConfigPath();
    checks.fileSystem = existsSync(configPath);
    
    // Verify configuration
    checks.configuration = existsSync('.env');

    return {
      healthy: Object.values(checks).every(v => v),
      checks,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    };
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
}

router.get('/health', async (req, res) => {
  try {
    const status = await performHealthCheck();
    res.json(status);
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
