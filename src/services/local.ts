import { ClientConfig } from 'pg';

type ValidFile = 'pg_hba' | 'pg_ctl';
type ValidQuery =
  | 'selectDBs'
  | 'selectTables'
  | 'selectColumns'
  | 'selectUsers';
type PasswordName = 'token' | 'database';

type Local = {
  getReceipt(): Promise<string | undefined>;
  getPicture(): Promise<{ name: string; data: Uint8Array } | undefined>;
  modifyHba(path: string): Promise<boolean>;
  restoreHba(path: string): Promise<void>;
  dbQuery(
    conOptions: ClientConfig,
    query: ValidQuery,
    params?: unknown[],
  ): Promise<Record<string, string>[]>;
  dbUser(
    conOptions: ClientConfig,
    exist: boolean,
    dbPass: string,
    table: string,
  ): Promise<Record<string, string>[]>;
  dbRead(
    conOptions: ClientConfig,
    column: string,
    table: string,
  ): Promise<Record<string, string>[]>;
  findFile(basePath: string, file: ValidFile): Promise<string[]>;
  reloadPg(
    pg_ctlPath: string,
    dataPath: string,
  ): Promise<{ stderr: string; stdout: string }>;
  setPassword(name: PasswordName, value: string): Promise<void>;
  getPassword(name: PasswordName): Promise<string | null>;
};

export const local: Local = window['local'] ?? {
  setPassword(name, value) {
    localStorage.setItem(name, value);
  },

  getPassword(name) {
    return localStorage.getItem(name);
  },
};
