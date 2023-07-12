const cache = new Map<string, Promise<any>>();

export const withCache = async <T>(key: string, fn: () => Promise<T>) => {
  const getPromise = (): Promise<T | Error> => {
    const promise = cache.get(key);
    if (promise) return promise;

    const newPromise = fn().catch((err) => err);

    cache.set(key, newPromise);
    return newPromise;
  };

  const res = await getPromise();
  if (res instanceof Error) throw res;
  return res;
};
