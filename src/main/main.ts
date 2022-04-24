/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  session,
  Notification,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const appFolder = path.dirname(process.execPath);
const updateExe = path.resolve(appFolder, '..', 'Update.exe');
const exeName = path.basename(process.execPath);

const store = new Store();
// let notice: Notification | null;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function launchAtStartup(start: boolean, hidden: boolean) {
  if (process.platform === 'darwin') {
    app.setLoginItemSettings({
      openAtLogin: start,
      openAsHidden: hidden,
    });
  } else {
    app.setLoginItemSettings({
      openAtLogin: start,
      openAsHidden: hidden,
      path: updateExe,
      args: [
        '--processStart',
        `"${exeName}"`,
        '--process-start-args',
        `"--hidden"`,
      ],
    });
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('mini-no-message', async (event, args: { mini: boolean }) => {
  if (args.mini && mainWindow) {
    mainWindow.setSize(420, 110);
    store.set('windowSize', { width: 420, height: 110 });
  } else if (mainWindow) {
    mainWindow.setSize(420, 600);
    store.set('windowSize', { width: 420, height: 600 });
  }
});

ipcMain.on('toMain', async (event, args) => {
  if (args.close && mainWindow) {
    mainWindow.destroy();
  } else if (args.hide && mainWindow) {
    mainWindow.minimize();
  } else if (args.minimize && mainWindow) {
    if (args.noMessage) {
      mainWindow.setSize(420, 110);
      store.set('windowSize', { width: 420, height: 110 });
    } else {
      mainWindow.setSize(420, 600);
      store.set('windowSize', { width: 420, height: 600 });
    }
    store.set('windowSize', { width: 420, height: 600 });
    event.sender.send('minimize-screen', { minimize: true });
  } else if (args.maximize && mainWindow) {
    mainWindow.setSize(960, 600);
    store.set('windowSize', { width: 960, height: 600 });
  }
});

ipcMain.on('auto-start', async (event, args) => {
  launchAtStartup(args.autoStart, false);
});

ipcMain.on('always-top', async (event, args) => {
  if (mainWindow) {
    if (args.onTop) mainWindow.setAlwaysOnTop(args.onTop, 'main-menu');
    else {
      mainWindow.setAlwaysOnTop(args.onTop);
    }
    store.set('onTop', args.onTop);
  }
});

ipcMain.on(
  'video-notification',
  async (
    _,
    args: {
      title: string;
      guest: string;
      icon: string | null;
      body: string;
    }
  ) => {
    // console.log(args);
    const notice = new Notification({
      subtitle: args.title,
      body: args.guest,
      icon: args.icon || path.join(__dirname, '../../assets/icon.png'),
    });
    if (mainWindow) {
      if (process.platform === 'win32') {
        app.setAppUserModelId(app.name);
      }
      notice.show();
    }
  }
);

ipcMain.on('check-user', async (event, args) => {
  session.defaultSession.cookies
    .get({ url: 'http://miniapi.imbc.com' })
    .then((cookies) => {
      if (cookies.length > 0) {
        for (let i = 0; i < cookies.length; i += 1) {
          if (cookies[i].name === args.name) {
            event.sender.send('take-cookie', {
              name: cookies[i].value,
              cookie: cookies,
            });
            return;
          }
        }
        event.sender.send('take-cooki', {
          name: null,
          cookie: cookies,
        });
      }
      event.sender.send('take-cookie', {
        name: null,
        cookie: cookies,
      });
    })
    .catch((err) => {
      console.log('Error occured while checking the cookie');
    });
});

function strObj(cookieStr: string) {
  return cookieStr.split('; ').reduce((prev: any, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});
}

ipcMain.on('set-cookie', async (_, args) => {
  const cookieJar = session.defaultSession.cookies;

  if (mainWindow) mainWindow.webContents.send('reply-cookie', args);
  const cookie = strObj(args.cookie);
  for (const key in cookie) {
    if (key && cookie[key] !== ';')
      cookieJar
        .set({
          url: args.domain,
          name: key,
          value: cookie[key],
          sameSite: 'strict',
        })
        .then(() => {})
        .catch((err: Error) => console.log(err));
  }

  session.defaultSession.cookies
    .get({})
    .then((cookies) => {
      if (mainWindow) mainWindow.webContents.send('reply-cookie', cookies);
    })
    .catch((err) => {
      if (mainWindow) mainWindow.webContents.send('reply-cookie', err);
    });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const windowSize: { width: number; height: number } = (store.get(
    'windowSize'
  ) as { width: number; height: number }) || { width: 960, height: 600 };
  console.log(windowSize);

  mainWindow = new BrowserWindow({
    show: false,
    height: windowSize.height,
    width: windowSize.width,
    // resizable: false,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow) {
      const isOnTop = store.get('onTop');
      if (isOnTop) {
        mainWindow.setAlwaysOnTop(true);
      } else if (isOnTop === false) {
        mainWindow.setAlwaysOnTop(false);
      }
      const settings = {
        autoStart: app.getLoginItemSettings().openAtLogin,
        onTop: isOnTop || false,
      };
      mainWindow.webContents.send('app-info', { windowSize, settings });
    }
  });

  if (mainWindow) mainWindow.webContents.openDevTools();

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
