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
    dsAPI: 'https://www.demarches-simplifiees.fr',
    dsToken: asString('DS_TOKEN'),

    dossierSynchroCron: '0 0 2 * * *',

    taskCron: '0 * * * * *',

    apiPrefix: asString('API_PREFIX'),
    // tslint:disable-next-line: object-literal-sort-keys
    apiPort: asNumber('API_PORT'),

    kintoAPI: asString('KINTO_URL'),
    kintoLogin: asString('KINTO_LOGIN'),
    kintoPassword: asString('KINTO_PASSWORD'),

    sentryEnabled: asBoolean('SENTRY_ENABLED'),
    sentryDSN: asString('SENTRY_DSN')
};

