import { resolve } from 'path';

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, 'src', 'database', 'dev.sqlite'),
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: resolve(__dirname, 'src', 'database', 'seeds'),
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
