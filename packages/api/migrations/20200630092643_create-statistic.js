exports.up = async function(knex) {
  return knex.schema.createTable("statistic", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table.jsonb("group").notNullable();
    table.integer("count").notNullable();
    table.float("duration").notNullable();
    table.specificType("durations", "float ARRAY").notNullable();
    table.jsonb("status").notNullable();
    table.jsonb("monthly").notNullable();
  });
};

exports.down = function(knex) {};
