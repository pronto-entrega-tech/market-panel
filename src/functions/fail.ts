const stringify = (v: Record<string, unknown>) => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return 'ERROR';
  }
};

export const fail = (msg?: string, debugValue?: Record<string, unknown>) => {
  const error = new Error(
    `${msg ?? ''}${debugValue ? `: ${stringify(debugValue)}` : ''}`,
  );
  Error.captureStackTrace(error);
  throw error;
};
