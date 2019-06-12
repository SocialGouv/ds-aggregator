
const asString = (env: typeof process.env, arg: string): string => {
    const res = env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return res;
}

const asNumber = (env: typeof process.env, arg: string): number => {
    const res = env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return Number.parseInt(res, 10);
}

const asBoolean = (env: typeof process.env, arg: string): boolean => {
    const res = env[arg];
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return 'true' === res ? true : false;
}


export const getConfiguration = (env: typeof process.env) => ({
    dsAPI: asString(env, 'DS_API'),
    dsToken: asString(env, 'DS_TOKEN'),

    dossierSynchroCron: asString(env, 'DOSSIER_SYNCHRO_CRON'),

    taskCron: asString(env, 'TASK_CRON'),

    apiPrefix: asString(env, 'API_PREFIX'),
    // tslint:disable-next-line: object-literal-sort-keys
    apiPort: asNumber(env, 'API_PORT'),

    kintoAPI: asString(env, 'KINTO_API'),
    kintoLogin: asString(env, 'KINTO_LOGIN'),
    kintoPassword: asString(env, 'KINTO_PASSWORD'),

    sentryEnabled: asBoolean(env, 'SENTRY_ENABLED'),
    sentryDSN: asString(env, 'SENTRY_DSN')
});

