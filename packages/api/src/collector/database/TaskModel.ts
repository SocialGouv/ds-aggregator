import { Model } from "objection";

class TaskModel extends Model {
  id!: string;
  procedure_id!: number;
  dossier_id!: number;
  state!: string;
  updated_at!: string;
  action!: "add_or_update" | "delete";

  static get tableName() {
    return "task";
  }

  static get idColumn() {
    return "id";
  }
}

export { TaskModel };
