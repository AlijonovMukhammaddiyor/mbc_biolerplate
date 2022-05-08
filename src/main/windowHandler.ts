/* eslint-disable import/prefer-default-export */
import {
  BrowserWindow,
  session,
  app,
  shell,
  Tray,
  Menu,
  globalShortcut,
} from 'electron';
import Store from 'electron-store';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';

let mainWindow: BrowserWindow | null = null;
const store = new Store();
// let opacity = 0;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function setCookieOnStart() {
  const cookieStored: any = store.get('cookie-info');
  const cookieJar = session.defaultSession.cookies;

  if (cookieStored?.cookie) {
    const cookie = strObj(cookieStored.cookie);

    // eslint-disable-next-line no-restricted-syntax
    for (const key in cookie) {
      if (key && cookie[key] !== ';')
        cookieJar
          .set({
            url: cookieStored.domain,
            name: key,
            value: cookie[key],
            sameSite: 'strict',
          })
          .then(() => {})
          .catch((err: Error) => console.log(err));
    }
  }
}

function strObj(cookieStr: string) {
  return cookieStr.split('; ').reduce((prev: any, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});
}

const installExtensions = async () => {
  // eslint-disable-next-line global-require
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

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const createWindow = async () => {
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
    transparent: true,
    opacity: 1,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow) {
      mainWindow.webContents.send('login-again', {});
      setCookieOnStart();
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

  // if (mainWindow) mainWindow.webContents.openDevTools();

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
  if (process.platform !== 'darwin')
    globalShortcut.register('Ctrl+Q', () => app.quit());

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  let tray: Tray | null = null;
  tray = new Tray(getAssetPath('icon_tray.png'));
  let visible = false;

  tray.on('click', () => {
    console.log(mainWindow?.isVisible());
    const obj = !mainWindow?.isVisible()
      ? {
          label: 'MBC Radio 보이기',
          click() {
            visible = !visible;
            mainWindow?.show();
            mainWindow?.focus();
          },
        }
      : {
          label: 'MBC Radio 숨기기',
          click() {
            if (process.platform === 'darwin') {
              app.hide();
            } else {
              mainWindow?.hide();
            }
            visible = !visible;
          },
        };
    const contextMenu = Menu.buildFromTemplate([
      obj,
      {
        label: '종료',
        click() {
          app.quit();
        },
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      },
    ]);
    tray?.setToolTip('MBC Radio');
    tray?.setContextMenu(contextMenu);
  });

  const obj = !mainWindow?.isVisible()
    ? {
        label: 'MBC Radio 보이기',
        click() {
          visible = !visible;
          mainWindow?.show();
          mainWindow?.focus();
        },
      }
    : {
        label: 'MBC Radio 숨기기',
        click() {
          if (process.platform === 'darwin') {
            app.hide();
          } else {
            mainWindow?.hide();
          }
          visible = !visible;
        },
      };
  const contextMenu = Menu.buildFromTemplate([
    obj,
    {
      label: '종료',
      click() {
        app.quit();
      },
      accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    },
  ]);
  tray?.setToolTip('MBC Radio');
  tray?.setContextMenu(contextMenu);

  return mainWindow;
};

export function getWindow() {
  return mainWindow;
}
