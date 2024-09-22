require("reflect-metadata");
const { promisify } = require("util");
const { ipcMain, dialog } = require("electron");
const { Client } = require("pg");
const fsPro = require("fs/promises");
const glob = promisify(require("glob"));
const exec = promisify(require("child_process").exec);
const keytar = require("keytar");

const keytarService = "ProntoEntrega";
const validatePasswordName = (name) => {
  const valid = ["token", "database"].includes(name);
  if (!valid) throw new Error("Invalid password name");
};

const hbaData =
  "#temp\nhost all all 127.0.0.1/32 trust\nhost all all ::1/128 trust\n#temp\n";

const escape = (v) => v.replace(/"/g, "");

const local = (channel, listener) => ({
  [channel]: () => {
    ipcMain.on(channel, async (event, ...args) => {
      try {
        const res = await listener(...args);

        event.sender.send(`${channel}-res`, { res });
      } catch (err) {
        event.sender.send(`${channel}-res`, { err });
      }
    });
  },
});

const dbQuery = (channel, listener) => ({
  [channel]: () => {
    ipcMain.on(channel, async (event, ...args) => {
      let client;
      try {
        const [conOptions, query, params] = await listener(...args);

        client = new Client(conOptions);
        await client.connect();

        const results = await client.query(query, params);

        event.sender.send(`${channel}-res`, { res: results });
      } catch (err) {
        event.sender.send(`${channel}-res`, { err });
      } finally {
        await client?.end();
      }
    });
  },
});

const downloadsPath =
  process.platform === "win32"
    ? "C:Users\\%USERPROFILE%\\Downloads"
    : "/Users/%USERPROFILE%/Downloads";

const apis = (win) => ({
  ...local("getReceipt", async () => {
    const res = await dialog.showOpenDialog(win, {
      title: 'Abra "NF-e.xml"',
      defaultPath: downloadsPath,
      properties: ["openFile"],
      filters: [{ name: "xml", extensions: ["xml"] }],
    });
    return res.filePaths[0];
  }),
  ...local("getPicture", async () => {
    const res = await dialog.showOpenDialog(win, {
      title: "Selecione uma imagem",
      defaultPath: downloadsPath,
      properties: ["openFile"],
      filters: [{ name: "image", extensions: ["jpg", "jpeg", "png", "gif"] }],
    });
    if (res.canceled) return;

    const file = await fsPro.readFile(res.filePaths[0]);

    return { name: res.filePaths[0].split("/").at(-1), data: file };
  }),
  ...dbQuery("dbQuery", (...args) => {
    const action = args[1];

    args[1] = (() => {
      const query = {
        selectDBs: "SELECT datname FROM pg_database",
        selectTables:
          "SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema='public'",
        selectColumns:
          "SELECT column_name FROM information_schema.columns WHERE table_name=$1",
        selectUsers: "SELECT 1 FROM pg_roles WHERE rolname='pe_reader'",
      }[action];

      if (!query) throw new Error("Invalid query");
      return query;
    })();

    return args;
  }),
  ...local("findFile", async (rawPath, file) => {
    const basePath = escape(rawPath);

    const path = {
      pg_hba: `${basePath}/**/pg_hba.conf`,
      pg_ctl: `${basePath}/**/pg_ctl`,
    }[file];
    if (!path) throw new Error("Invalid file");

    return await glob(path);
  }),
  ...local("modifyHba", async (rawPath) => {
    const path = escape(rawPath);
    if (!path.endsWith("/pg_hba.conf")) throw new Error("Invalid file");

    const original = await fsPro.readFile(path, "utf8");

    const alreadyModified = original.startsWith(hbaData);
    if (!alreadyModified) {
      await fsPro.writeFile(path, hbaData + original);
    }
    return alreadyModified;
  }),
  ...local("restoreHba", async (rawPath) => {
    const path = escape(rawPath);
    if (!path.endsWith("/pg_hba.conf")) throw new Error("Invalid file");

    const original = (await fsPro.readFile(path)).toString();

    if (original.startsWith(hbaData)) {
      await fsPro.writeFile(path, original.replace(hbaData, ""));
    }
  }),
  ...dbQuery("dbUser", (conOptions, exist, ...rawParams) => {
    const [pass, table] = rawParams.map(escape);
    const action = !exist ? "CREATE USER" : "ALTER ROLE";

    const query = `${action} pe_reader WITH PASSWORD "${pass}"; GRANT SELECT ON "${table}" TO pe_reader`;

    return [conOptions, query];
  }),
  ...dbQuery("dbRead", (conOptions, ...rawParams) => {
    const [columns, table] = rawParams.map(escape);

    const query = `SELECT ${columns} FROM '${table}'`;

    return [conOptions, query];
  }),
  ...local("reloadPg", async (...args) => {
    const [pg_ctlPath, dataPath] = args.map(escape);

    return await exec(`"${pg_ctlPath}" -D "${dataPath}" reload`);
  }),
  ...local("setPassword", async (name, value) => {
    validatePasswordName(name);
    return keytar.setPassword(keytarService, name, value);
  }),
  ...local("getPassword", async (name) => {
    validatePasswordName(name);
    return keytar.getPassword(keytarService, name);
  }),
});

exports.apisList = Object.keys(apis());

exports.setupApi = (win) =>
  Object.values(apis(win)).forEach((setup) => setup());
