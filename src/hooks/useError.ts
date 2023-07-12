import { useState, useCallback } from 'react';

export const useError = () => {
  const [hasError, setHasError] = useState(false);

  const setError = useCallback(() => setHasError(true), []);
  const tryAgain = useCallback(() => setHasError(false), []);

  return [hasError, setError, tryAgain] as const;
};
