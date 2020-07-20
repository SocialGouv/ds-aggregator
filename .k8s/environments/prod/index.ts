import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { ok } from "assert";

ok(process.env.CI_PROJECT_NAME);

export default {
  subdomain: `wif.${process.env.CI_PROJECT_NAME}`,
} as GlobalEnvironment;
