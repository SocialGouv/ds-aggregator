import { config } from 'dotenv';

config();

export const configuration = { 
    dsToken: process.env.DS_TOKEN,
    dsAPI: process.env.DS_API,

    kintoAPI: process.env.KINTO_API,
    kintoLogin: process.env.KINTO_LOGIN,
    kintoPassword: process.env.KINTO_PASSWORD,
};