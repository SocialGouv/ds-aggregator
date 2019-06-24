import { config } from "dotenv";
import { getConfiguration } from "./config";

config({ path: "./../../.env" });

//

process.env.TZ = "Europe/Paris";

export const configuration = getConfiguration(process.env);
