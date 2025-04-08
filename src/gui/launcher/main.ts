import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { validateEnv } from '../../utils/env-validator';
import { getPlatformConfigPath } from '../../utils/platform';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    title: 'QIIEM Financial App',
    show: false, // Don't show until ready
    frame: false // Frameless window for modern look
  });

  win.loadFile(join(__dirname, 'launcher.html'));
  win.once('ready-to-show', () => {
    win.show();
  });

  return win;
}

// System check handler
ipcMain.handle('check-system', async () => {
  const missingComponents = [];
  
  // Check required directories
  const configPath = getPlatformConfigPath();
  const requiredPaths = ['logs', 'dist', configPath];
  
  for (const path of requiredPaths) {
    if (!existsSync(path)) {
      missingComponents.push(`Directory: ${path}`);
    }
  }

  // Check Node.js version
  const nodeVersion = process.version;
  if (!nodeVersion.startsWith('v14') && !nodeVersion.startsWith('v16')) {
    missingComponents.push('Compatible Node.js version (v14 or v16)');
  }

  // Check environment setup
  try {
    validateEnv();
  } catch (error) {
    missingComponents.push('Environment configuration');
  }

  return {
    ready: missingComponents.length === 0,
    missingComponents
  };
});

// Setup handler
ipcMain.handle('setup-directories', async () => {
  const configPath = getPlatformConfigPath();
  const directories = ['logs', 'dist', configPath];
  
  for (const dir of directories) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  // Install dependencies
  execSync('npm install', { stdio: 'inherit' });
  
  // Run setup script
  execSync('npm run setup', { stdio: 'inherit' });
});

// Main app launch handler
ipcMain.handle('start-main-app', () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: join(__dirname, '..', 'preload.js')
    }
  });

  mainWindow.loadFile(join(__dirname, '..', 'index.html'));
});

// Add this IPC handler
ipcMain.handle('run-npm-command', async (event, command: string) => {
  try {
    const { stdout, stderr } = await execAsync(`npm ${command}`, {
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: '0' }
    });

    if (stderr) {
      console.warn('Command warning:', stderr);
    }

    console.log('Command output:', stdout);
    return stdout;
  } catch (error) {
    console.error('Command failed:', error);
    throw error;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
