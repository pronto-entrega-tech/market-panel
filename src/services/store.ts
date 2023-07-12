import {
  writeConfigRequest,
  readConfigResponse,
  readConfigRequest,
} from 'secure-electron-store';

const rawStore = window['local']?.store as
  | undefined
  | {
      send: (config: string, key: string, value?: unknown) => void;
      clearRendererBindings: () => void;
      onReceive: (
        config: string,
        callback: (res: { success: boolean; value: unknown }) => void,
      ) => void;
    };

type DbData = {
  database: string;
  table: string;
  column: string[];
};

// all the store's key and type of the value
type Store = {
  dbData: DbData;
};

export const store = rawStore
  ? {
      set<K extends keyof Store>(key: K, value: Store[K]) {
        rawStore.send(writeConfigRequest, key, value);
      },

      get<K extends keyof Store>(key: K) {
        return new Promise<Store[K]>((resolve, reject) => {
          rawStore.onReceive(readConfigResponse, ({ success, value }) => {
            rawStore.clearRendererBindings();
            if (!success) return reject();
            resolve(value as Store[K]);
          });
          rawStore.send(readConfigRequest, key);
        });
      },
    }
  : {
      set<K extends keyof Store>(key: K, value: Store[K]) {
        localStorage.setItem(key, JSON.stringify(value));
      },

      get<K extends keyof Store>(key: K) {
        const stringValue = localStorage.getItem(key);

        return stringValue && JSON.parse(stringValue);
      },
    };
