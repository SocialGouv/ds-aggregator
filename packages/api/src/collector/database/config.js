const Knex = require("knex");
const connection = require("../../../knexfile");
const { Model } = require("objection");

export default () => {
  const knexConnection = Knex(connection);
  Model.knex(knexConnection);
};
