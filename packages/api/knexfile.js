// Update with your config settings.

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: "localhost",
    port: "5433",
    database: "postgres",
    user: "postgres",
    password: "postgres"
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
};
