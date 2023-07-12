const mutexKeys = new Set<string>();

export const withMutex = async (key: string, fn: () => Promise<void>) => {
  if (mutexKeys.has(key)) return;

  mutexKeys.add(key);
  await fn();
  mutexKeys.delete(key);
};
