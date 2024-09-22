const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;
const { apisList } = require("./api.cjs");

// Create the electron store to be made available in the renderer process
const store = new Store();

const addApis = apisList.reduce(
  (apis, channel) => ({
    ...apis,
    [channel]: (...args) =>
      new Promise((resolve, reject) => {
        ipcRenderer.on(`${channel}-res`, (_e, { err, res }) => {
          ipcRenderer.removeAllListeners(`${channel}-res`);
          if (err) return reject(err);
          resolve(res);
        });
        ipcRenderer.send(channel, ...args);
      }),
  }),
  {},
);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("local", {
  store: store.preloadBindings(ipcRenderer, fs),
  contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  ...addApis,
});
