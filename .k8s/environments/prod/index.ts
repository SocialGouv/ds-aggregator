import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { ok } from "assert";

import globalDevEnv from "../dev";

ok(process.env.CI_PROJECT_NAME);

export default {
  ...globalDevEnv,
  subdomain: `wif.${process.env.CI_PROJECT_NAME}`,
} as GlobalEnvironment;
