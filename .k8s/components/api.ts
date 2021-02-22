import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Container } from "kubernetes-models/v1/Container";
import { create } from "@socialgouv/kosko-charts/components/app";
import { ok } from "assert";
import { join } from "path";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";
import { addInitContainer } from "@socialgouv/kosko-charts/utils/addInitContainer";

import { importYamlFolder } from "@socialgouv/kosko-charts/components/yaml";

const yamlManifests = importYamlFolder(
  join(__dirname, "..", `environments/${env.env}/yaml`)
);

const manifests = create("api", {
  env,
  config: {
    image: getHarborImagePath({ name: "ds-aggregator" }),
    containerPort: 4000,
    container: {
      envFrom: [
        {
          configMapRef: {
            name: "api-env",
          },
        },
        {
          secretRef: {
            name: "api-env",
          },
        },
      ],
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
      resources: {
        requests: {
          cpu: "5m",
          memory: "128Mi",
        },
        limits: {
          cpu: "1000m",
          memory: "1Gi",
        },
      },
    },
  },
});

const deployment = manifests.find(
  (manifest: { kind: string }): manifest is Deployment =>
    manifest.kind === "Deployment"
);

ok(deployment);
ok(deployment.spec);
ok(deployment.spec.template.spec);

const initContainer = new Container({
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
});
addInitContainer(deployment, initContainer);

export default [...manifests, () => yamlManifests];
