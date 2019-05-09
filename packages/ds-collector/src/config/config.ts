import { config } from 'dotenv';
import { asNumber } from '../util';

config();

export const configuration = {
    dsAPI: process.env.DS_API,
    dsToken: process.env.DS_TOKEN,

    taskSchedulerPeriod: asNumber(process.env.TASK_SCHEDULER_PERIOD, 1000 * 60 * 60),

    apiPrefix: process.env.API_PREFIX,
    // tslint:disable-next-line: object-literal-sort-keys
    apiPort: process.env.API_PORT || 1337,

    kintoAPI: process.env.KINTO_API,
    kintoLogin: process.env.KINTO_LOGIN,
    kintoPassword: process.env.KINTO_PASSWORD,
};

