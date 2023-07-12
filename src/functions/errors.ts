const getStatus = (err: any) => err.response?.status;

export const is401 = (err: unknown) => getStatus(err) === 401;

export const is404 = (err: unknown) => getStatus(err) === 404;

export const is500 = (err: unknown) => getStatus(err) === 500;
