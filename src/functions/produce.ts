export const produce = <T extends Record<string, unknown> | Array<unknown>>(
  v: T,
  fn: (v: T) => void,
): T => {
  const newV = (Array.isArray(v) ? [...v] : { ...v }) as T;
  fn(newV);
  return newV;
};
