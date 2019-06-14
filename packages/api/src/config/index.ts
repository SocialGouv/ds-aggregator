import { config } from "dotenv";
import { getConfiguration } from "./config";

config();

//

export const configuration = getConfiguration(process.env);
