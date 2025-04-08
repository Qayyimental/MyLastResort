const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  checkSystem: () => ipcRenderer.invoke('check-system'),
  setupDirectories: () => ipcRenderer.invoke('setup-directories'),
  checkRequirement: (name) => ipcRenderer.invoke('check-requirement', name),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info')
});
