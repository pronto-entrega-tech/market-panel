import { ClientConfig } from 'pg';
import { local } from '~/services/local';
import crypto from 'crypto';
import { store } from '../services/store';

const conOptionsBase: ClientConfig = {
  port: 5432,
};

const conOptions: ClientConfig = {
  ...conOptionsBase,
  user: 'postgres',
};

export async function dbCreateUser(
  dialog: (title: string, items: string[]) => Promise<string>,
  dialogMulti: (title: string, items: string[]) => Promise<string[]>,
) {
  try {
    const basePath1 = '~/Library/Application Support/Postgres';
    const basePath2 = '~/Applications/Postgres.app';

    const [pg_hbaPath] = await local.findFile(basePath1, 'pg_hba');
    if (!pg_hbaPath) return 'error';

    const alreadyModified = await local.modifyHba(pg_hbaPath);

    const [pg_ctlPath] = await local.findFile(basePath2, 'pg_ctl');
    const dataPath = pg_hbaPath.substring(0, pg_hbaPath.length - 12);

    if (!alreadyModified) {
      if (!pg_ctlPath) return 'restart';
      await local.reloadPg(pg_ctlPath, dataPath);
    }

    // create password
    const dbPass = crypto.randomBytes(32).toString('base64url');
    local.setPassword('database', dbPass);

    // choice database
    const dbsRes = await local.dbQuery(conOptions, 'selectDBs');

    const dbsNames = dbsRes.map((res) => res.datname);

    const database = await dialog('Escolha um database', dbsNames);

    // choice table
    const conOptions2: ClientConfig = {
      ...conOptions,
      database: database,
    };
    const tablesRes = await local.dbQuery(conOptions2, 'selectTables');

    const tablesNames = tablesRes.map((res) => res.table_name);

    const table = await dialog('Escolha uma table', tablesNames);

    // choice column
    const columnsRes = await local.dbQuery(conOptions2, 'selectColumns', [
      table,
    ]);

    const columnsNames = columnsRes.map((res) => res.column_name);

    const column = await dialogMulti('Escolha as columns', columnsNames);

    store.set('dbData', {
      database,
      table,
      column,
    });

    // check if user already exist
    const usersRes = await local.dbQuery(conOptions2, 'selectUsers');
    const exist = !!usersRes.length;

    // create or alter role
    await local.dbUser(conOptions2, exist, dbPass, table);

    await local.restoreHba(pg_hbaPath);

    if (pg_ctlPath) await local.reloadPg(pg_ctlPath, dataPath);

    return 'success';
  } catch (err) {
    console.error(err);
    return 'error';
  }
}

export async function dbRead() {
  try {
    /* const test = await local.test();
    alert(test); */

    const dbPass = await local.getPassword('database');
    const dbData = await store.get('dbData');

    const conOptionsReader: ClientConfig = {
      ...conOptionsBase,
      user: 'pe_reader',
      password: dbPass,
      database: dbData.database,
    };
    const createResult = await local.dbRead(
      conOptionsReader,
      JSON.stringify(dbData.column).replace(/[[\]]/g, ''),
      dbData.table,
    );

    alert(JSON.stringify(createResult));
    return createResult;
  } catch (err) {
    return console.error(err);
  }
}
