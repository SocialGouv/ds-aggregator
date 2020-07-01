import { Model } from "objection";
import { DSDossierItem } from "../../demarche-simplifiee";
import { SynchroAction } from "../model/api-result.model";

class APIResultModel extends Model {
  id!: string;
  procedure!: number;
  items: DSDossierItem[] = [];
  actions: SynchroAction[] = [];

  static get tableName() {
    return "api_result";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "string" },
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: { type: "string" },
              procedure: { type: "integer" },
              item: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  nom_projet: { type: "string" },
                  updated_at: { type: "string" },
                  initiated_at: { type: "string" },
                  state: { type: "string" },
                },
              },
            },
          },
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              nom_projet: { type: "string" },
              updated_at: { type: "string" },
              initiated_at: { type: "string" },
              state: { type: "string" },
            },
          },
        },
      },
    };
  }
}

export { APIResultModel };
