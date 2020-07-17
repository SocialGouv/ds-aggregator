import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/app";
import { ok } from "assert";

const { deployment, ingress, service } = create(env.component("api"));

ok(deployment.spec);
ok(deployment.spec.template.spec);
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
