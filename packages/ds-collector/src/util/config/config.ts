import { config } from 'dotenv';

config();

const asArray = (args: string) => {
    if(args == undefined || args == null){
        return [];
    }
    args = args.trim();
    return args.split(",").map(val => val.trim());
}

export const configuration = {
    dsToken: process.env.DS_TOKEN,
    dsAPI: process.env.DS_API,
    dsProcedureIds: asArray(process.env.DS_PROCEDURE_IDS || ''),

    kintoAPI: process.env.KINTO_API,
    kintoLogin: process.env.KINTO_LOGIN,
    kintoPassword: process.env.KINTO_PASSWORD,
};

