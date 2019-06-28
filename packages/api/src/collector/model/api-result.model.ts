import { DSDossierItem } from "../../demarche-simplifiee";
import { IIdentifiable } from "../../util";

export interface SynchroAction {
  action: "add_or_update" | "delete";
  item: DSDossierItem;
  procedure: number;
}

export interface APIResult extends IIdentifiable {
  id?: string;
  procedure: number;
  items: DSDossierItem[];
  actions: SynchroAction[];
}
