import { Model } from "objection";

class SynchroHistoryModel extends Model {
  id!: string;
  scheduler!: string;
  last_synchro!: number;

  static get tableName() {
    return "synchro_history";
  }

  static get idColumn() {
    return "id";
  }
}

export { SynchroHistoryModel };
