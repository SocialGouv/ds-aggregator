import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/app";
import { ok } from "assert";
import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

const params: AppComponentEnvironment & GlobalEnvironment = env.component(
  "api"
);
const { deployment, ingress, service } = create(params);

ok(deployment.spec);
ok(deployment.spec.template.spec);
deployment.spec.template.spec.containers[0].livenessProbe = {
  httpGet: {
    port: params.containerPort,
    path: "/api/liveness",
  },
};
deployment.spec.template.spec.containers[0].readinessProbe = {
  httpGet: {
    port: params.containerPort,
    path: "/api/readiness",
  },
};
deployment.spec.template.spec.containers[0].envFrom = [
  {
    secretRef: {
      name: "api-env",
    },
  },
  {
    configMapRef: {
      name: "api-env",
    },
  },
];
export default [deployment, ingress, service];
