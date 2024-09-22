declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "secure-electron-store" {
  export const writeConfigRequest: string;
  export const readConfigRequest: string;
  export const readConfigResponse: string;
}

// Otimazation
declare type Omit<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Array<T> {
  /**
   * Is like filter but mutates the array.
   */
  pick(
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Map<K, V> {
  /**
   * Is like delete but return the map.
   */
  remove(key: K): this;
}
