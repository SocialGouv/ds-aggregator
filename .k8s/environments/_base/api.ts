import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { ok } from "assert";

ok(process.env.CI_REGISTRY_IMAGE);
ok(process.env.CI_COMMIT_SHA);

const env: AppComponentEnvironment = {
  containerPort: 4000,

  image: {
    name: `${process.env.CI_REGISTRY_IMAGE}/api`,
    tag: process.env.CI_COMMIT_TAG
      ? process.env.CI_COMMIT_TAG.slice(1)
      : process.env.CI_COMMIT_SHA,
  },

  ingress: {
    secretName: process.env.PRODUCTION ? "api-crt" : "wildcard-crt",
  },

  labels: {
    component: "koa",
  },
  name: "api",

  requests: {
    cpu: "5m",
    memory: "128Mi",
  },

  limits: {
    cpu: "100m",
    memory: "1Gi",
  },

  servicePort: 80,
};

export default env;
