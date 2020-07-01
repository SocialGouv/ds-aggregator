exports.up = async function(knex) {
  return knex.schema.createTable("dossier_record", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table
      .string("ds_key")
      .notNullable()
      .unique();
    table.jsonb("ds_data").notNullable();
    table.jsonb("metadata").notNullable();
    table.integer("procedure_id").notNullable();
    table.timestamp("created_at").notNullable();
  });
};

exports.down = function(knex) {};
