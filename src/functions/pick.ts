export const pick = <T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> =>
  keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {} as any);
