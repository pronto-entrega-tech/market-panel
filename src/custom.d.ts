/// <reference types="vite/client" />

declare module "secure-electron-store" {
  export const writeConfigRequest: string;
  export const readConfigRequest: string;
  export const readConfigResponse: string;
}

// Optimization
declare type Omit<T, K extends keyof object> = {
  [P in Exclude<keyof T, K>]: T[P];
};

declare interface Array<T> {
  /**
   * Is like filter but mutates the array.
   */
  pick(
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: unknown,
  ): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Map<K, V> {
  /**
   * Is like delete but return the map.
   */
  remove(key: K): this;
}

declare type UnknownRecord = Record<string, unknown>;
