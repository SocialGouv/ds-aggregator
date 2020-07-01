exports.up = async function(knex) {
  return knex.schema.alterTable("dossier_record", table => {
    table.timestamp("processed_at");
    table.timestamp("last_modified");
    table.string("state");
  });
};

exports.down = function(knex) {};
