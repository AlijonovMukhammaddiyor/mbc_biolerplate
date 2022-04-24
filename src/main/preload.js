const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('electron', {
    Notification,
    ipcRenderer: {
      send: (channel, args) => {
        ipcRenderer.send(channel, args);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      receive: (channel, listener) => {
        // Show me the prototype (use DevTools in the render thread)
        // console.log(ipcRenderer);
        // Deliberately strip event as it includes `sender`.
        ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
      },
      // From render to main and back again.
      invoke: (channel, args) => {
        return ipcRenderer.invoke(channel, args);
      },
      removeListener: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
      },
    },
  });
});
