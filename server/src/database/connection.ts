import knex from 'knex';
import { resolve } from 'path';

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, 'dev.sqlite'),
  },
  useNullAsDefault: true,
});

export default connection;
