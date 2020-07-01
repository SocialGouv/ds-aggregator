exports.up = async function(knex) {
  return knex.schema.createTable("procedure_record", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table
      .integer("ds_key")
      .notNullable()
      .unique();
    table.jsonb("ds_data").notNullable();
  });
};

exports.down = function(knex) {};
