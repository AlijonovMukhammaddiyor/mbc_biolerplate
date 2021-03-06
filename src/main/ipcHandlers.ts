import { ipcMain, app, Notification, session, dialog, shell } from 'electron';
import path from 'path';
import Store from 'electron-store';

import { getWindow } from './windowHandler';

import { openAuthWindow, handleLoginResult } from './authWindow';

const mainWindow = getWindow();
const store = new Store();

function launchAtStartup(start: boolean, hidden: boolean) {
  app.setLoginItemSettings({
    openAtLogin: start,
    openAsHidden: hidden,
  });
}

ipcMain.on('app-quit', async (_, args) => {});

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
    // if()
    if (process.platform === 'darwin') app.hide();
    else {
      mainWindow.hide();
    }
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
    if (process.platform === 'win32') {
      app.setAppUserModelId(app.name);
    }
    const notice = new Notification({
      subtitle: args.title,
      body: args.guest,
      icon: path.join(__dirname, '../../assets/icon.png'),
    });
    if (mainWindow) {
      if (process.platform === 'win32') {
        app.setAppUserModelId(app.name);
      }
      notice.show();
    }
  }
);

ipcMain.on('opacity-change', async (event, args) => {
  if (mainWindow) {
    mainWindow.setOpacity(args.opacity < 0.1 ? 0.1 : args.opacity);
  }
});

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
        event.sender.send('take-cookie', {
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

ipcMain.on('logout', (event, _) => {
  session.defaultSession
    .clearStorageData({ storages: ['cookies'] })
    .then(() => {
      console.log('All cookies cleared');
      event.sender.send('logout-complete', { success: 'ok' });
    })
    .catch((error) => {
      console.error('Failed to clear cookies: ', error);
    });

  store.set('cookie-info', { cookie: null, domain: null });
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

  // if (mainWindow) mainWindow.webContents.send('reply-cookie', args);
  const cookie = strObj(args.cookie);
  store.set('cookie-info', { cookie: args.cookie, domain: args.domain });
  // eslint-disable-next-line no-restricted-syntax
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
});

ipcMain.on('sns-login', async (event, { snsType }) => {
  const data = (await openAuthWindow(snsType)) as {
    [key: string]: string | object;
  };

  if (data.State && data.State === 'S') {
    event.sender.send('sns-login-success', {
      data,
    });
  } else {
    const ButtonList = data.ButtonList as Array<{
      [key: string]: string;
    }> | null;
    const ReturnMsg = data.ReturnMsg as string;

    if (ButtonList != null) {
      const confirmResult = dialog.showMessageBoxSync({
        type: 'question',
        buttons: ButtonList.map(({ Title }) => Title),
        title: 'Log In',
        message: ReturnMsg,
      });

      handleLoginResult(ButtonList[confirmResult]);
    }
  }
});

ipcMain.on('redirect-to-action-url', (event, { ActionURL }) => {
  if (ActionURL) {
    shell.openExternal(ActionURL);
  }
});
