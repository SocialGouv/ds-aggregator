const asString = (env: typeof process.env, arg: string): string => {
  const res = env[arg];
  if (!res) {
    throw new Error(`env variable ${arg} is required`);
  }
  return res;
};

const asNumber = (env: typeof process.env, arg: string): number => {
  const res = env[arg];
  if (!res) {
    throw new Error(`env variable ${arg} is required`);
  }
  return Number.parseInt(res, 10);
};

const asBoolean = (env: typeof process.env, arg: string): boolean => {
  const res = env[arg];
  if (!res) {
    throw new Error(`env variable ${arg} is required`);
  }
  return "true" === res ? true : false;
};

export const getConfiguration = (env: typeof process.env) => ({
  dsAPI: asString(env, "DS_API"),
  dsToken: asString(env, "DS_TOKEN"),

  dossierSynchroCron: "0 15 * * * *",

  taskCron: "0 * * * * *",

  apiPort: asNumber(env, "API_PORT"),
  apiPrefix: asString(env, "API_PREFIX"),

  kintoAPI: asString(env, "KINTO_URL"),
  kintoLogin: asString(env, "KINTO_LOGIN"),
  kintoPassword: asString(env, "KINTO_PASSWORD"),

  sentryDSN: asString(env, "SENTRY_DSN"),
  sentryEnabled: asBoolean(env, "SENTRY_ENABLED")
});
