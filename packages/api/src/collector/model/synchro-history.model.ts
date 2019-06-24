import { IIdentifiable } from "../../util";

export interface SynchroHistory extends IIdentifiable {
  id?: string;
  scheduler: string;
  last_synchro: number;
}
