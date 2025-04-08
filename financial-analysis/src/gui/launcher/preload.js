const { contextBridge, ipcRenderer } = require('electron');

// ...existing code...

contextBridge.exposeInMainWorld('electron', {
  checkSystem: () => ipcRenderer.invoke('check-system'),
  checkRequirement: (req) => ipcRenderer.invoke('check-requirement', req),
  setupDirectories: () => ipcRenderer.invoke('setup-directories'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  startMainApp: () => ipcRenderer.invoke('start-main-app'),
  runNpmCommand: (command) => ipcRenderer.invoke('run-npm-command', command)
});