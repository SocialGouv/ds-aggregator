//

import { getConfiguration } from "../../../src/config/config";

const validEnv = {
  API_PORT: "123456",
  API_PREFIX: "API_PREFIX",
  DOSSIER_SYNCHRO_CRON: "DOSSIER_SYNCHRO_CRON",
  DS_API: "DS_API",
  DS_TOKEN: "DS_TOKEN",
  KINTO_API: "KINTO_API",
  KINTO_LOGIN: "KINTO_LOGIN",
  KINTO_PASSWORD: "KINTO_PASSWORD",
  SENTRY_DSN: "SENTRY_DSN",
  SENTRY_ENABLED: "true",
  TASK_CRON: "TASK_CRON"
};

it("should return the env configuration", () => {
  const env = { ...validEnv };
  expect(getConfiguration(env)).toMatchInlineSnapshot(`
        Object {
          "apiPort": 123456,
          "apiPrefix": "API_PREFIX",
          "dossierSynchroCron": "DOSSIER_SYNCHRO_CRON",
          "dsAPI": "DS_API",
          "dsToken": "DS_TOKEN",
          "kintoAPI": "KINTO_API",
          "kintoLogin": "KINTO_LOGIN",
          "kintoPassword": "KINTO_PASSWORD",
          "sentryDSN": "SENTRY_DSN",
          "sentryEnabled": true,
          "taskCron": "TASK_CRON",
        }
    `);
});

it("sentryEnabled should be false is not 'true'", () => {
  const env = { ...validEnv, SENTRY_ENABLED: "lol" };
  expect(getConfiguration(env).sentryEnabled).toBeFalsy();
});

it.each(Object.keys(validEnv))("fails if missing %s", (x) => {
  const env = { ...validEnv, [x]: undefined };
  expect(() => getConfiguration(env)).toThrowError(/env variable \w+ is required/);
});
