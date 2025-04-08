import { existsSync } from 'fs';
import { validateEnv } from '../src/utils/env-validator';
import { getPlatformConfigPath } from '../src/utils/platform';

function checkEnvironment() {
    // Check required directories
    const requiredPaths = [
        'logs',
        'dist',
        'public',
        getPlatformConfigPath()
    ];

    const missingPaths = requiredPaths.filter(path => !existsSync(path));
    if (missingPaths.length > 0) {
        console.error('Missing required directories:', missingPaths);
        console.log('Running setup to fix missing components...');
        require('./automate-setup');
        return;
    }

    // Validate environment variables
    try {
        validateEnv();
    } catch (error) {
        console.error('Environment validation failed:', error.message);
        console.error('Please check your .env file configuration');
        process.exit(1);
    }

    // Check database connection
    try {
        // Add database connection check here when implemented
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

checkEnvironment();
