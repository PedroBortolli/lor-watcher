const { app, BrowserWindow } = require('electron');
const path = require('path');
import express from 'express';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function isDebug() {
  return process.env.npm_lifecycle_event === 'start';
}

app.disableHardwareAcceleration();

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800, //400
    height: 900, //800
    //maxWidth: 600,
    //maxHeight: 900,
    //minWidth: 200,
    //minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
      //devTools: false
    }
  });

  // and load the index.html of the app.
  if (isDebug()) {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    //mainWindow.setAlwaysOnTop(true, 'screen');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
  else {
    const exApp = express();
    exApp.use(express.static(path.resolve(__dirname, '..', 'renderer')));
    const server = exApp.listen(0, () => {
      mainWindow.loadURL(`http://localhost:${server.address().port}/main_window/`);
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
