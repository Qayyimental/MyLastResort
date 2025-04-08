import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { getPlatformConfigPath } from '../src/utils/platform';

const requiredDirs = [
    'logs',
    'public',
    'dist',
    'dist/exe',
    'dist/packaged',
    'launchers',
    'models/tensorflow_model'
];

async function automateSetup() {
    console.log('Starting automated setup...');

    try {
        // Create all required directories
        console.log('Creating required directories...');
        requiredDirs.forEach(dir => {
            const path = join(process.cwd(), dir);
            if (!existsSync(path)) {
                mkdirSync(path, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        });

        // Create platform-specific config directory
        const configPath = getPlatformConfigPath();
        if (!existsSync(configPath)) {
            mkdirSync(configPath, { recursive: true });
            console.log('Created platform config directory');
        }

        // Setup environment file if it doesn't exist
        if (!existsSync('.env')) {
            copyFileSync('.env.example', '.env');
            console.log('Created .env file from template');
        }

        // Install system dependencies based on platform
        console.log('Installing system dependencies...');
        if (process.platform === 'linux') {
            try {
                execSync('which apt-get >/dev/null 2>&1 && ' +
                    'sudo apt-get update && sudo apt-get install -y libcairo2-dev libpango1.0-dev libfontconfig1-dev || ' +
                    'which dnf >/dev/null 2>&1 && ' +
                    'sudo dnf install -y cairo-devel pango-devel fontconfig-devel');
            } catch (error) {
                console.warn('Could not install system dependencies automatically');
            }
        }

        // Install npm dependencies
        console.log('Installing npm dependencies...');
        execSync('npm install', { stdio: 'inherit' });

        // Build the project
        console.log('Building project...');
        execSync('npm run build', { stdio: 'inherit' });

        // Create executables
        console.log('Creating executables...');
        execSync('npm run make-exe', { stdio: 'inherit' });

        // Initialize git if not already initialized
        if (!existsSync('.git')) {
            console.log('Initializing git repository...');
            execSync('git init', { stdio: 'inherit' });
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
        }

        console.log('\nSetup completed successfully!');
        console.log('\nYou can now run the application using:');
        console.log('npm start          # For backend server');
        console.log('npm run start-gui  # For GUI application');

    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

automateSetup();
