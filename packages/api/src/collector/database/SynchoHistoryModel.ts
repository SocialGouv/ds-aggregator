import { Model } from "objection";
import { SynchroHistory } from "../model";

class SynchroHistoryModel extends Model implements SynchroHistory {
  id!: string;
  scheduler: string = "";
  last_synchro: Date = new Date(0);

  static get tableName() {
    return "synchro_history";
  }

  static get idColumn() {
    return "id";
  }
}

export { SynchroHistoryModel };
