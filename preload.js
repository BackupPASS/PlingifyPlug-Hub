const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkPath: (filePath) => ipcRenderer.invoke('check-path', filePath),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),
  openWebsite: (url) => ipcRenderer.invoke('open-website', url),
  getLocalAppData: () => process.env.LOCALAPPDATA
});
