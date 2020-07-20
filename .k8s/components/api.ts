import env from "@kosko/env";
import { create } from "@socialgouv/kosko-charts/components/app";
import { ok } from "assert";
import { AppComponentEnvironment } from "@socialgouv/kosko-charts/components/app/params";
import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";
import { IIoK8sApiCoreV1Container } from "kubernetes-models/_definitions/IoK8sApiCoreV1Container";

const params: AppComponentEnvironment & GlobalEnvironment = env.component(
  "api"
);
const { deployment, ingress, service } = create(params);

ok(deployment.spec);
ok(deployment.spec.template.spec);
const container: IIoK8sApiCoreV1Container = {
  ...deployment.spec.template.spec.containers[0],
  livenessProbe: {
    httpGet: {
      port: "http",
      path: "/api/liveness",
    },
  },
  readinessProbe: {
    httpGet: {
      port: "http",
      path: "/api/readiness",
    },
  },
  startupProbe: {
    httpGet: {
      port: "http",
      path: "/api/liveness",
    },
  },

  envFrom: [
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
  ],
};

deployment.spec.template.spec.containers[0] = container;
deployment.spec.template.spec.initContainers = [
  {
    name: "knex-migrate",
    image: deployment.spec.template.spec.containers[0].image,
    command: ["yarn"],
    args: ["migrate"],
    resources: {
      requests: {
        cpu: "1000m",
        memory: "256Mi",
      },
      limits: {
        cpu: "1000m",
        memory: "256Mi",
      },
    },
    envFrom: [
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
    ],
  },
];
export default [deployment, ingress, service];
