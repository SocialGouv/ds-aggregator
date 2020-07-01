exports.up = async function(knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("synchro_history", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table.string("scheduler").notNullable();
    table.timestamp("last_synchro").notNullable();
  });
};

exports.down = function(knex) {};
