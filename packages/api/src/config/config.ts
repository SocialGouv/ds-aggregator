import { config } from 'dotenv';

config();

const asString = (arg: any): string => {
    const res = process.env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return res;
}

const asNumber = (arg: any): number => {
    const res = process.env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return Number.parseInt(res, 10);
}

const asBoolean = (arg: any): boolean => {
    const res = process.env[arg];
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return 'true' === res ? true : false;
}


export const configuration = {
    dsAPI: asString('DS_API'),
    dsToken: asString('DS_TOKEN'),

    dossierSynchroCron: asString('DOSSIER_SYNCHRO_CRON'),

    taskCron: asString('TASK_CRON'),

    apiPrefix: asString('API_PREFIX'),
    // tslint:disable-next-line: object-literal-sort-keys
    apiPort: asNumber('API_PORT'),

    kintoAPI: asString('KINTO_API'),
    kintoLogin: asString('KINTO_LOGIN'),
    kintoPassword: asString('KINTO_PASSWORD'),

    sentryEnabled: asBoolean('SENTRY_ENABLED'),
    sentryDSN: asString('SENTRY_DSN')
};

