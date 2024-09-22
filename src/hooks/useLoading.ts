import { useState } from "react";

type AsyncFunction = (...args: any[]) => any | Promise<any>;

export const useLoading = () => {
  const [isLoading, setLoading] = useState(false);

  const withLoading = <T extends AsyncFunction>(fn: T) =>
    (async (...args) => {
      setLoading(true);
      const res = await fn(...args);
      setLoading(false);

      return res;
    }) as T;

  return [isLoading, setLoading, withLoading] as const;
};
