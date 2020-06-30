exports.up = async function(knex) {
  return knex.schema.createTable("task", table => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    table.integer("procedure_id").notNullable();
    table.integer("dossier_id").notNullable();
    table.string("state").notNullable();
    table.string("updated_at");
    table.string("action");
  });
};

exports.down = function(knex) {};
