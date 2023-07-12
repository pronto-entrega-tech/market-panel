import { dbRead } from './dbConnect';

const dbSync = () =>
  setInterval(async () => {
    console.log('query db');

    const query = await dbRead();

    console.log(query);
  }, 1 * 60 * 1000);

export default dbSync;
