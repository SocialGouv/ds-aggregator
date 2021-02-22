import { ok } from "assert";
import env from "@kosko/env"
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret"

import { loadYaml } from "@socialgouv/kosko-charts/utils/getEnvironmentComponent"
import { getPgServerHostname } from "@socialgouv/kosko-charts/utils/getPgServerHostname"
import { updateMetadata } from "@socialgouv/kosko-charts/utils/updateMetadata"
import gitlab from "@socialgouv/kosko-charts/environments/gitlab"

import { createSecret } from "@socialgouv/kosko-charts/components/pg-secret";
import { createDbJob } from "@socialgouv/kosko-charts/components/azure-pg/create-db.job";
import { getDevDatabaseParameters } from "@socialgouv/kosko-charts/components/azure-pg/params";



export default () => {
  ok(process.env.CI_ENVIRONMENT_SLUG, "Missing CI_ENVIRONMENT_SLUG");
  ok(process.env.CI_PROJECT_NAME, "Missing CI_PROJECT_NAME");

  const envParams = gitlab(process.env)

  if (env.env === "dev") {
    const sha = process.env.CI_ENVIRONMENT_SLUG.replace(/-dev2$/g, "")
    const dbParams = getDevDatabaseParameters({suffix: sha.replace(/-/g, "_")})

    const job = createDbJob(dbParams);
    updateMetadata(job, {
      annotations: envParams.annotations ?? {},
      labels: envParams.labels ?? {},
      name: `create-db-job-${sha}`,
      namespace: envParams.namespace,
    });

    const secret = createSecret({
      ...dbParams,
      host: getPgServerHostname(process.env.CI_PROJECT_NAME, "dev"),
    });
    updateMetadata(secret, {
      name: `azure-pg-user-${sha}`,
      namespace: envParams.namespace,
    });

    return [job, secret];
  }

  // in prod/preprod, we try to add a fixed sealed-secret
  const secret = loadYaml<SealedSecret>(env, `pg-user.sealed-secret.yaml`)
  if (!secret) {
    return []
  }

  // add gitlab annotations
  updateMetadata(secret, {
    annotations: envParams.annotations || {},
    labels: envParams.labels || {},
    namespace: envParams.namespace,
  })
  return [secret]
}
