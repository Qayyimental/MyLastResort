const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  
  // CSP Header
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'"]
      }
    });
  });

  // Dev tools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

function createSetupWindow() {
  const setupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  setupWindow.loadFile(path.join(__dirname, 'setup.html'));
  return setupWindow;
}

// Initialize setup status checker
let setupComplete = false;
let mainWindow = null;

app.whenReady().then(async () => {
  try {
    const setupStatus = await store.get('setupComplete');
    if (!setupStatus) {
      mainWindow = createSetupWindow();
    } else {
      mainWindow = createWindow();
    }
  } catch (error) {
    console.error('Failed to check setup status:', error);
    mainWindow = createSetupWindow();
  }
});

// Add IPC handlers for setup operations
ipcMain.handle('check-system', async () => {
  // Implement system checks
});

ipcMain.handle('setup-directories', async () => {
  // Implement directory setup
});

// IPC handlers for financial operations
ipcMain.handle('get-financial-data', async () => {
  // Implement data fetching
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
