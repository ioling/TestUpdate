import { app, BrowserWindow, ipcMain  } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import pkg from 'electron-updater';
import log from 'electron-log'
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'debug';
log.info('App starting...');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    //mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
    autoUpdater.forceDevUpdateConfig = true;
  } else {
    //mainWindow .loadFile(path.join(__dirname, 'dist/index.html'))
  }
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // 检查更新
  checkForUpdates();
})

// 退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 检查更新函数
function checkForUpdates() {
  // 开发环境模拟更新
  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow.webContents.send('update-message', '开发模式不检查更新');
  //   return;
  // }

  // 正式环境检查更新
  autoUpdater.checkForUpdatesAndNotify();

  // 设置自动检查更新定时器 (每小时检查一次)
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60 * 60 * 1000);
}

// 自动更新事件监听
autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('update-message', '正在检查更新...');
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update-message', `发现新版本: ${info.version}`);
  mainWindow.webContents.send('update-available', info.version);
});

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('update-message', '当前已是最新版本');
});

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-message', `更新错误: ${err.message}`);
});

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('download-progress', {
    percent: progressObj.percent,
    bytesPerSecond: progressObj.bytesPerSecond,
    transferred: progressObj.transferred,
    total: progressObj.total
  });
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update-message', '更新下载完成，准备安装...');
  mainWindow.webContents.send('update-downloaded', info.version);

  // 询问用户是否立即安装
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
  });
});