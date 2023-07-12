import axios, { AxiosError } from 'axios';
import { Url } from '~/constants/urls';
import { events } from '~/services/events';
import { getAccessToken } from '~/core/accessToken';

const apiCall = axios.create({
  baseURL: Url.Api,
  transformRequest: [
    (data) => {
      if (data)
        Object.entries(data).forEach(([key, value]) => {
          if (value === '') delete data[key];
        });

      return data;
    },
    ...(axios.defaults.transformRequest as []),
  ],
});

const stringify = (v: any) => JSON.stringify(v, null, 2);
const format = (v: any) => {
  try {
    return v && stringify(JSON.parse(v));
  } catch (err) {
    return 'ERROR';
  }
};

apiCall.interceptors.response.use(undefined, (err: AxiosError) => {
  if (err.response?.status === 401) {
    events.emit('unauthorized');
  }

  const errMsg = [
    `${err.config.method?.toUpperCase()} ${err.request?.responseURL}`,
    `Request ${format(err.config.data)}`,
    `Response ${stringify(err.response?.data)}`,
  ].join('\n');
  console.error(errMsg);

  err.message = errMsg;
  return Promise.reject(err);
});

const authHeader = async () => ({
  headers: { Authorization: `Bearer ${await getAccessToken()}` },
});

export default { apiCall, authHeader };
