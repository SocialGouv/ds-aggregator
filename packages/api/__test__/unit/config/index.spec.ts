//

import { getConfiguration } from "../../../src/config/config";

const validEnv = {
  API_PORT: "123456",
  API_PREFIX: "API_PREFIX",
  DS_TOKEN: "DS_TOKEN",
  ENVIRONMENT_TYPE: "dev.local",
  KINTO_LOGIN: "KINTO_LOGIN",
  KINTO_PASSWORD: "KINTO_PASSWORD",
  KINTO_URL: "KINTO_URL",
  SCHEDULER_CRON_DS: "SCHEDULER_CRON_DS",
  SCHEDULER_CRON_TASK: "SCHEDULER_CRON_TASK",
  SENTRY_DSN: "SENTRY_DSN",
  SENTRY_ENABLED: "true"
};

it("should return the env configuration", () => {
  const env = { ...validEnv };
  expect(getConfiguration(env)).toMatchInlineSnapshot(`
    Object {
      "apiPort": 123456,
      "apiPrefix": "API_PREFIX",
      "dsToken": "DS_TOKEN",
      "kintoLogin": "KINTO_LOGIN",
      "kintoPassword": "KINTO_PASSWORD",
      "kintoURL": "KINTO_URL",
      "schedulerCronDS": "SCHEDULER_CRON_DS",
      "schedulerCronTask": "SCHEDULER_CRON_TASK",
      "sentryDSN": "SENTRY_DSN",
      "sentryEnabled": true,
    }
  `);
});

it("sentryEnabled should be false is not 'true'", () => {
  const env = { ...validEnv, SENTRY_ENABLED: "lol" };
  expect(getConfiguration(env).sentryEnabled).toBeFalsy();
});
