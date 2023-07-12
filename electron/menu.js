const { Menu } = require('electron');

const MenuBuilder = function () {
  // https://electronjs.org/docs/api/menu#main-process
  const defaultTemplate = function () {
    return [
      // { role: "fileMenu" }
      /* {
        label: 'File',
        submenu: [
          {
            role: 'quit',
            label: 'Exit',
          },
        ],
      }, */
      // { role: "editMenu" }
      {
        label: 'Edit',
        submenu: [
          {
            role: 'undo',
            label: 'Undo',
          },
          {
            role: 'redo',
            label: 'Redo',
          },
          {
            type: 'separator',
          },
          {
            role: 'cut',
            label: 'Cut',
          },
          {
            role: 'copy',
            label: 'Copy',
          },
          {
            role: 'paste',
            label: 'Paste',
          },

          {
            role: 'delete',
            label: 'Delete',
          },
          {
            type: 'separator',
          },
          {
            role: 'selectAll',
            label: 'Select All',
          },
        ],
      },
      // { role: "viewMenu" }
      {
        label: 'View',
        submenu: [
          {
            role: 'reload',
            label: 'Reload',
          },
          {
            role: 'forcereload',
            label: 'Force Reload',
          },
          {
            role: 'toggledevtools',
            label: 'Toggle Developer Tools',
          },
          {
            type: 'separator',
          },
          {
            role: 'resetzoom',
            label: 'Reset Zoom',
          },
          {
            role: 'zoomin',
            label: 'Zoom In',
          },
          {
            role: 'zoomout',
            label: 'Zoom Out',
          },
          {
            type: 'separator',
          },
          {
            role: 'togglefullscreen',
            label: 'Toggle Fullscreen',
          },
        ],
      },
      // { role: "windowMenu" }
      {
        label: 'Window',
        submenu: [
          {
            role: 'minimize',
            label: 'Minimize',
          },
          {
            role: 'zoom',
            label: 'Zoom',
          },

          {
            role: 'close',
            label: 'Close',
          },
        ],
      },
    ];
  };

  return {
    buildMenu: function () {
      const menu = null; //Menu.buildFromTemplate(defaultTemplate());
      Menu.setApplicationMenu(menu);

      return menu;
    },
  };
};

module.exports = MenuBuilder;
