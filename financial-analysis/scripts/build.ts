import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

function buildProject() {
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    const launchersDir = join(__dirname, '..', 'launchers');
    if (!existsSync(launchersDir)) {
        mkdirSync(launchersDir);
    }
    
    // Create Linux launcher script with automation
    const linuxLauncher = join(launchersDir, 'launch.sh');
    writeFileSync(linuxLauncher, `#!/bin/bash
cd "$(dirname "$0")"
cd ..

# Check for updates
git pull origin main

# Install/update dependencies
npm install

# Run automation
npm run automate

# Start the application
npm start
`);
    execSync(`chmod +x "${linuxLauncher}"`);

    // Create Windows launcher script with automation
    const windowsLauncher = join(launchersDir, 'launch.bat');
    writeFileSync(windowsLauncher, `@echo off
cd %~dp0
cd ..

:: Check for updates
git pull origin main

:: Install/update dependencies
call npm install

:: Run automation
call npm run automate

:: Start the application
call npm start
pause
`);

    console.log('Build completed successfully!');
}

buildProject();
