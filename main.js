const { app, BrowserWindow, ipcMain, shell, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'PlingifyPlug Hub',
    icon: path.join(__dirname, 'assets', 'PlingifyPlugLogo.ico')
  });

  mainWindow.loadFile('index.html');

  // ✅ Top-level navigation buttons
  const menuTemplate = [
    {
      label: 'Home',
      click: () => mainWindow.loadFile('index.html')
    },
    {
      label: 'Back',
      click: () => {
        if (mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack();
      }
    },
    {
      label: 'Forward',
      click: () => {
        if (mainWindow.webContents.canGoForward()) mainWindow.webContents.goForward();
      }
    },
    {
      label: 'Reload',
      click: () => mainWindow.webContents.reload()
    },
    {
      label: 'Check for Updates',
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      }
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // ✅ Auto-update events
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update available',
      message: 'A new version is available. Downloading now...'
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update ready',
      message: 'Update downloaded. The app will now restart to install the update.'
    }).then(() => {
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Update error', err == null ? "unknown" : (err.stack || err).toString());
  });

  // Automatically check for updates on start
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ✅ IPC handlers
ipcMain.handle('check-path', (event, filePath) => fs.existsSync(filePath));
ipcMain.handle('open-path', (event, filePath) => shell.openPath(filePath));
ipcMain.handle('open-website', (event, url) => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.loadURL(url);
});
