exports.up = async function(knex) {
  return knex.schema.createTable("api_result", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table.integer("procedure");
    table.jsonb("items");
    table.jsonb("actions");
  });
};

exports.down = function(knex) {};
