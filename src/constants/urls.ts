const useDevApi = process.env.CLIENT_USE_DEV_API === 'true';
const isDev = process.env.NODE_ENV === 'development';
const localIp = process.env.CLIENT_LOCAL_IP;

const prodApi = 'https://api.prontoentrega.com.br';
const devApi = `http://${localIp ?? 'localhost'}:3000`;

const devStatic = `${devApi}/static`;
const prodStatic = 'https://static.prontoentrega.com.br';

const Api = useDevApi && isDev ? devApi : prodApi;

const ApiWs = Api.replace('3000', '3002');

const Static = useDevApi && isDev ? devStatic : prodStatic;

export const Url = { Api, ApiWs, Static };
