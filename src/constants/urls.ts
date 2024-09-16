const isDev = process.env.NODE_ENV === 'development';

const prodApi = 'https://api.prontoentrega.com.br';
const devApi = `http://localhost:3000`;

const devStatic = `${devApi}/static`;
const prodStatic = 'https://static.prontoentrega.com.br';

const Api = isDev ? devApi : prodApi;

const ApiWs = Api.replace('3000', '3002');

const Static = isDev ? devStatic : prodStatic;

export const Url = { Api, ApiWs, Static };
