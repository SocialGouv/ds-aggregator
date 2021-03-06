type EnvironmentType = "prod" | "dev.factory" | "dev.local";

const asString = (
  env: typeof process.env,
  arg: string,
  defaultValue: string
): string => {
  const res = env[arg];
  if (!res) {
    return defaultValue;
  }
  return res;
};

const asNumber = (
  env: typeof process.env,
  arg: string,
  defaultValue: number
): number => {
  const res = env[arg];
  if (!res) {
    return defaultValue;
  }
  return Number.parseInt(res, 10);
};

const asBoolean = (
  env: typeof process.env,
  arg: string,
  defaultValue: boolean
): boolean => {
  const res = env[arg];
  if (!res) {
    return defaultValue;
  }
  return "true" === res ? true : false;
};

const configByEnvironment: {
  [key in EnvironmentType]: any;
} = {
  "dev.factory": () => ({
    schedulerCronDS: "0 */10 * * * *",
    schedulerCronTask: "0 */5 * * * *",
    sentryEnabled: false,
  }),
  "dev.local": (env: typeof process.env) => ({
    schedulerCronDS: asString(env, "SCHEDULER_CRON_DS", "0 0 * * * *"),
    schedulerCronTask: asString(env, "SCHEDULER_CRON_TASK", "0 */10 * * * *"),
    sentryEnabled: asBoolean(env, "SENTRY_ENABLED", false),
  }),
  prod: () => ({
    schedulerCronDS: "0 30 * * * *",
    schedulerCronTask: "0 */10 * * * *",
    sentryEnabled: true,
  }),
};

export const getConfiguration = (env: typeof process.env) => {
  const environmentType = env.ENVIRONMENT_TYPE as EnvironmentType;
  const envConfigFn = configByEnvironment[environmentType];
  const envConfig = envConfigFn(env);

  return {
    apiPort: asNumber(env, "API_PORT", 4000),
    apiPrefix: asString(env, "API_PREFIX", "v1"),
    dsToken: asString(env, "DS_TOKEN", "DS_TOKEN"),
    envType: asString(env, "ENVIRONMENT_TYPE", environmentType),
    schedulerCronDS: envConfig.schedulerCronDS,
    schedulerCronTask: envConfig.schedulerCronTask,
    sentryDSN: asString(env, "SENTRY_DSN", ""),
    sentryEnabled: envConfig.sentryEnabled,
    version: asString(env, "VERSION", require("../../package.json").version),
  };
};
