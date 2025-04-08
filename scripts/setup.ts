import { mkdirSync, existsSync } from 'fs';
import { getPlatformConfigPath } from '../src/utils/platform';
import { execSync } from 'child_process';

function setupEnvironment() {
    const configPath = getPlatformConfigPath();
    
    if (!existsSync(configPath)) {
        mkdirSync(configPath, { recursive: true });
    }

    // Check and install required system dependencies
    try {
        if (process.platform === 'linux') {
            // Check for required Linux packages
            const packages = ['libcairo2-dev', 'libpango1.0-dev', 'libfontconfig1-dev'];
            console.log('Checking Linux dependencies...');
            execSync('which apt-get >/dev/null 2>&1 && ' +
                    'sudo apt-get install -y ' + packages.join(' ') + ' || ' +
                    'which dnf >/dev/null 2>&1 && ' +
                    'sudo dnf install -y ' + packages.join(' '));
        }
    } catch (error) {
        console.warn('Could not automatically install system dependencies:', error);
        console.log('Please install required packages manually.');
    }
}

setupEnvironment();
