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
import { app, dialog, Notification } from 'electron';

import { createWindow, getWindow, openWindow } from './windowHandler';

let isQuitting = false;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    openWindow();
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

  app.on('before-quit', (e) => {
    if (!isQuitting) {
      let choice = -1;
      if (getWindow())
        choice = dialog.showMessageBoxSync(getWindow()!, {
          type: 'question',
          buttons: ['종료', '취소'],
          title: 'Confirm',
          message: 'MBC mini를 종료하시겠습니까?',
        });
      if (choice === 1) {
        e.preventDefault();
      } else {
        isQuitting = true;
        app.quit();
      }
    }
  });

  app
    .whenReady()
    .then(() => {
      // eslint-disable-next-line no-new
      new Notification();

      // eslint-disable-next-line promise/no-nesting
      createWindow().then(() => {
        // console.log('window is ', getWindow());
        app.on('activate', () => {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (getWindow() === null) {
            createWindow();
          }
        });
        require('./ipcHandlers');
      });
    })
    .catch(console.log);
}
// let notice: Notification | null;
