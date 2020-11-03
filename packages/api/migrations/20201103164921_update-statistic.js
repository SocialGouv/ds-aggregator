exports.up = function(knex) {
  return knex("statistic")
    .whereRaw(`"group"->>'type' is null`)
    .update({
      group: knex.raw(`jsonb_set("group", '{type}', '"autorisation"')`)
    });
};

exports.down = function(knex) {
  return knex("statistic")
    .update({
      group: knex.raw(`"group" - 'type'`)
    })
};
