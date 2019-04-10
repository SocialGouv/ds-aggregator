import { config } from 'dotenv';

config();

export const configuration = { 
    dsToken: process.env.DS_TOKEN,
    dsAPI: process.env.DS_API
};