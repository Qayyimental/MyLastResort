import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getPlatformConfigPath } from '../src/utils/platform';

function createLaunchers() {
    const launchersDir = join(__dirname, '..', 'launchers');
    if (!existsSync(launchersDir)) {
        mkdirSync(launchersDir);
    }

    // Create universal launcher for Windows
    writeFileSync(join(launchersDir, 'START.bat'), `@echo off
echo Starting Financial Analysis Tool...
cd %~dp0
cd ..

:: Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed! Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Pull latest changes if in git repo
if exist .git (
    git pull
) else (
    echo Warning: Not a git repository, skipping updates
)

:: Install or update dependencies
call npm install

:: Run automation script
call npm run automate

:: Start the application
call npm start
pause
`);

    // Create universal launcher for Linux/Mac
    const unixLauncher = join(launchersDir, 'START.sh');
    writeFileSync(unixLauncher, `#!/bin/bash
echo "Starting Financial Analysis Tool..."
cd "$(dirname "$0")"
cd ..

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed! Please install Git first."
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed! Please install Node.js first."
    read -p "Press Enter to exit..."
    exit 1
fi

# Pull latest changes if in git repo
if [ -d ".git" ]; then
    git pull
else
    echo "Warning: Not a git repository, skipping updates"
fi

# Install or update dependencies
npm install

# Run automation script
npm run automate

# Start the application
npm start
`);
    
    // Make the Unix launcher executable
    execSync(`chmod +x "${unixLauncher}"`);
}

function automate() {
    console.log('Starting automated setup and launch...');

    // Setup environment
    console.log('Setting up environment...');
    try {
        // Create universal launchers first
        console.log('Creating launcher scripts...');
        createLaunchers();

        // Create necessary directories
        const configPath = getPlatformConfigPath();
        if (!existsSync(configPath)) {
            mkdirSync(configPath, { recursive: true });
        }

        // Install dependencies
        console.log('Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });

        // Run setup script
        console.log('Running setup...');
        execSync('npm run setup', { stdio: 'inherit' });

        // Build the project
        console.log('Building project...');
        execSync('npm run build', { stdio: 'inherit' });

        // Create executables
        console.log('Creating executables...');
        execSync('npm run make-exe', { stdio: 'inherit' });

        // Launch GUI by default
        console.log('Launching GUI...');
        execSync('npm run start-gui', { stdio: 'inherit' });

        // Additional success message with usage instructions
        console.log('\nSetup completed successfully!');
        console.log('\nThe application GUI is now running.');
    } catch (error) {
        console.error('Automation failed:', error);
        process.exit(1);
    }
}

automate();
