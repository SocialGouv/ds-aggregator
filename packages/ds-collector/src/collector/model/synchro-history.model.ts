import { IIdentifiable } from "../../util";

export interface SynchroHistory extends IIdentifiable {
    scheduler: string;
    last_synchro: number;
}