export const range = (first: number, last: number, step = 1) => {
  const size = Math.trunc((last - first) / step) + 1;
  return size < 1 ? [] : [...Array(size).keys()].map((i) => i * step + first);
};
