import axios from "axios";

const getStatus = (err: unknown) =>
  axios.isAxiosError(err) && err.response?.status;

export const is401 = (err: unknown) => getStatus(err) === 401;

export const is404 = (err: unknown) => getStatus(err) === 404;

export const is500 = (err: unknown) => getStatus(err) === 500;
