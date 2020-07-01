import { Model } from "objection";

class ProcedureConfigModel extends Model {
  id!: string;
  procedures!: number[];
  group!: {
    id: string;
    label: string;
  };

  static get tableName() {
    return "procedure_config";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
        group: {
          type: "object",
          properties: {
            label: { type: "string" },
            id: { type: "string" },
          },
        },
      },
    };
  }
}

export { ProcedureConfigModel };
