import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Container } from "kubernetes-models/v1/Container";
import { create } from "@socialgouv/kosko-charts/components/app";
import { ok } from "assert";
import { join } from "path";
import { getHarborImagePath } from "@socialgouv/kosko-charts/utils/getHarborImagePath";
import { addInitContainer } from "@socialgouv/kosko-charts/utils/addInitContainer";

import { waitForPostgres } from "@socialgouv/kosko-charts/utils/waitForPostgres";
import { importYamlFolder } from "@socialgouv/kosko-charts/components/yaml";

ok(process.env.CI_ENVIRONMENT_SLUG, "Missing CI_ENVIRONMENT_SLUG");
const sha = process.env.CI_ENVIRONMENT_SLUG.replace(/-dev2$/g, "")

const yamlManifests = importYamlFolder(
  join(__dirname, "..", `environments/${env.env}/yaml`)
);

const manifests = create("api", {
  env,
  config: {
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

addInitContainer(
  deployment,
  waitForPostgres({
    secretRefName: process.env.CI_COMMIT_TAG
      ? "azure-pg-user"
      : `azure-pg-user-${sha}`,
  })
);
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
