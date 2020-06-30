exports.up = async function(knex) {
  return knex.schema.createTable("procedure_config", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table.specificType("procedures", "integer ARRAY");
    table.jsonb("group");
  });
};

exports.down = function(knex) {};
