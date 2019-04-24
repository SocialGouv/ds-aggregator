import { config } from 'dotenv';

config();

const asArray = (args: string) => {
    if(args === undefined || args == null){
        return [];
    }
    args = args.trim();
    return args.split(",").map(val => val.trim());
}

export const configuration = {
    dsAPI: process.env.DS_API,
    dsProcedureIds: asArray(process.env.DS_PROCEDURE_IDS || ''),
    dsToken: process.env.DS_TOKEN,
    dsWebHookKey: process.env.DS_WEBHOOK_KEY,

    apiPort: process.env.API_PORT || 1337,

    kintoAPI: process.env.KINTO_API,
    kintoLogin: process.env.KINTO_LOGIN,
    kintoPassword: process.env.KINTO_PASSWORD,
};

