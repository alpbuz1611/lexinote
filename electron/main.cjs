const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Arch Linux / container sandbox compatibility
app.commandLine.appendSwitch('no-sandbox');

function createWindow() {
  const iconPath = fs.existsSync(path.join(__dirname, '../build/icon.png'))
    ? path.join(__dirname, '../build/icon.png')
    : path.join(__dirname, '../public/icons/icon-512.png');

  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 500,
    minHeight: 600,
    title: "LexiNote — Offline Bilingual Knowledge Workstation",
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    backgroundColor: '#09090b',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = process.argv.includes('--dev');
  const distIndexPath = path.join(__dirname, '../dist/index.html');

  if (isDev) {
    win.loadURL('http://127.0.0.1:5252').catch(() => {
      if (fs.existsSync(distIndexPath)) {
        win.loadFile(distIndexPath);
      }
    });
  } else {
    if (fs.existsSync(distIndexPath)) {
      win.loadFile(distIndexPath);
    } else {
      win.loadURL('http://127.0.0.1:5252');
    }
  }

  // Open external web links in default system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
