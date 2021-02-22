import { ok } from "assert";

const {
  createDbJob,
} = require("@socialgouv/kosko-charts/components/azure-pg/create-db.job");

ok(process.env.CI_COMMIT_REF_NAME, "Missing CI_COMMIT_REF_NAME");

const job = createDbJob({
  database: `dsaggregator-${process.env.CI_COMMIT_REF_NAME}`,
  user: `dsaggregator-${process.env.CI_COMMIT_REF_NAME}`,
  password: `dsaggregator-${process.env.CI_COMMIT_REF_NAME}`,
});


export default [job];
