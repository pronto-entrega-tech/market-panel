const {
  app,
  protocol,
  BrowserWindow,
  session,
  ipcMain,
  Menu,
} = require("electron");
const Protocol = require("./protocol.cjs");
const MenuBuilder = require("./menu.cjs");
const { setupApi } = require("./api.cjs");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const isDev = process.env.NODE_ENV === "development";
const port = 5173; // Hardcoded; needs to match vite
const selfHost = `http://localhost:${port}`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let menuBuilder;

async function createWindow() {
  app.setLoginItemSettings({
    openAtLogin: true,
  });

  if (!isDev) {
    // Needs to happen before creating/loading the browser window
    // protocol is only used in prod
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler); // eng-disable PROTOCOL_HANDLER_JS_CHECK
  }

  // Store options should be in main and preload
  // except path/unprotectedPath options, main only
  const store = new Store({
    path: app.getPath("userData"),
  });

  // Use saved config values for configuring the
  // BrowserWindow, for instance.
  // NOTE - this config is not password protected
  // and stores plaintext values
  // let savedConfig = store.mainInitialStore(fs);

  let windowState;
  try {
    const buffer = fs.readFileSync(
      path.join(app.getPath("userData"), "windowState.json"),
    );
    windowState = JSON.parse(buffer.toString());
  } catch (err) {
    console.error("!!!  windowState loading error");
    console.error(err);
  }

  if (!windowState) {
    windowState = {
      window: 100,
      isMaximized: false,
      bounds: { x: undefined, y: undefined, width: 1200, height: 680 },
    };
  }
  const securePref = {
    devTools: isDev,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    contextIsolation: true,
    enableRemoteModule: false,
  };

  // Create the main window
  win = new BrowserWindow({
    x: windowState.bounds.x,
    y: windowState.bounds.y,
    width: windowState.bounds.width,
    height: windowState.bounds.height,
    minWidth: 780,
    minHeight: 420,
    title: "ProntoEntrega",
    show: false,
    webPreferences: {
      ...securePref,
      additionalArguments: [
        `--storePath=${store.sanitizePath(app.getPath("userData"))}`,
      ],
      preload: path.join(__dirname, "preload.cjs"),
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: "Auxclick",
    },
  });

  // Create the splash screen
  const splashScreen = new BrowserWindow({
    minWidth: 400,
    minHeight: 280,
    width: 500,
    height: 280,
    show: false,
    center: true,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: securePref,
  });

  if (windowState.isMaximized) {
    win.maximize();
  }

  // Sets up main.js bindings for our electron store
  // callback is optional and allows you to use store in main process
  function callback(success, initialStore) {
    console.log(
      `${!success ? "Un-s" : "S"}uccessfully retrieved store in main process.`,
    );
    console.log(initialStore); // {"key1": "value1", ... }
  }

  store.mainBindings(ipcMain, win, fs, callback);

  // Sets up bindings for our custom context menu
  ContextMenu.mainBindings(ipcMain, win, Menu, isDev, {
    loudAlertTemplate: [
      {
        id: "loudAlert",
        label: "AN ALERT!",
      },
    ],
    softAlertTemplate: [
      {
        id: "softAlert",
        label: "Soft alert",
      },
    ],
  });

  function storeWindowState() {
    windowState.isMaximized = win.isMaximized();
    if (!windowState.isMaximized) {
      // only update bounds if the window isn’t currently maximized
      windowState.bounds = win.getBounds();
    }

    fs.writeFileSync(
      path.join(app.getPath("userData"), "windowState.json"),
      JSON.stringify(windowState),
    );
  }

  ["resize", "move", "close"].forEach((e) => {
    win.on(e, storeWindowState);
  });

  // Load app
  if (isDev) {
    win.loadURL(selfHost);
    splashScreen.loadURL(`${selfHost}/splashscreen.html`);
  } else {
    win.loadURL(`${Protocol.scheme}://rse/index.html`);
    splashScreen.loadURL(`${Protocol.scheme}://rse/splashscreen.html`);
  }

  // Only show the splashScreen when ready
  splashScreen.once("ready-to-show", () => {
    splashScreen.show();
  });

  // Only show the window when ready
  win.once("ready-to-show", () => {
    splashScreen.destroy();
    win.show();
    win.focus();
    // Start auto updater
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Only do these things when in development
  if (isDev) {
    // Errors are thrown if the dev tools are opened
    // before the DOM is ready
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");

    win.webContents.once("dom-ready", async () => {
      await installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err))
        .finally(() => {
          require("electron-debug")(); // https://github.com/sindresorhus/electron-debug
          win.webContents.openDevTools();
        });
    });
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // https://electronjs.org/doc/latests/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = "default";
  ses
    .fromPartition(
      partition,
    ) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`,
        );

        permCallback(false); // Deny
      }
    });

  // https://electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content;
  // The below code can only run when a scheme and host are defined, I thought
  // we could use this over _all_ urls
  // ses.fromPartition(partition).webRequest.onBeforeRequest({urls:["http://localhost./*"]}, (listener) => {
  //   if (listener.url.indexOf("http://") >= 0) {
  //     listener.callback({
  //       cancel: true
  //     });
  //   }
  // });

  menuBuilder = MenuBuilder(win, app.name);
}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/latest/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    ContextMenu.clearMainBindings(ipcMain);
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// https://electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`,
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on("will-redirect", (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`,
      );

      contentsEvent.preventDefault();
    }
  });

  // https://electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
  contents.on(
    "will-attach-webview",
    (contentsEvent, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload;
      delete webPreferences.preloadURL;

      // Disable Node.js integration
      webPreferences.nodeIntegration = false;

      // Disable or verify URL being loaded
      contentsEvent.preventDefault();
    },
  );

  // https://electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
  // This code replaces the old "new-window" event handling;
  // https://github.com/electron/electron/pull/24517#issue-447670981
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const validOrigins = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`,
      );

      return {
        action: "deny",
      };
    }

    return {
      action: "allow",
    };
  });
});

setupApi(win);
