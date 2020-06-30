import Knex = require("knex");
import { Model } from "objection";

export default () => {
  const knexConnection = Knex(
    require(process.env.KNEXFILE || "../../../knexfile")
  );
  Model.knex(knexConnection);
};
