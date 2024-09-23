import { useState } from "react";

export const useLoading = () => {
  const [isLoading, setLoading] = useState(false);

  const withLoading =
    <Args extends unknown[]>(
      fn: (...args: Args) => unknown | Promise<unknown>,
    ) =>
    async (...args: Args) => {
      setLoading(true);
      const res = await fn(...args);
      setLoading(false);

      return res;
    };

  return [isLoading, setLoading, withLoading] as const;
};
