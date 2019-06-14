import { config } from "dotenv";
import { getConfiguration } from "./config";

config({ path: "./../../.env" });

//

export const configuration = getConfiguration(process.env);
