import { Model } from "objection";
import { DossierRecord, DossierRecordMetadata } from "../model/record.model";
import { DSDossier } from "../../demarche-simplifiee";

class DossierRecordModel extends Model implements DossierRecord {
  id?: string;
  processed_at?: Date;
  last_modified?: Date;
  state?: string;
  ds_data: DSDossier = {
    id: 0,
    state: "draft",
    created_at: "",
    updated_at: "",
    initiated_at: "",
    received_at: "",
    processed_at: "",
    instructeurs: []
  };
  ds_key: string = "";
  metadata: DossierRecordMetadata = {
    state: "draft",
    procedure_id: 0,
    group: {
      id: "",
      label: ""
    },
    initiated_at: 0,
    updated_at: 0,
    received_at: 0,
    processed_at: 0,
    created_at: 0,
    instructors_history: []
  };
  procedure_id: number = 0;
  created_at: Date = new Date(0);

  static get tableName() {
    return "dossier_record";
  }

  static get idColumn() {
    return "id";
  }

  // static get jsonSchema() {
  //   return {
  //     type: "object",
  //     properties: {
  //       id: { type: "string" },
  //       metadata: {
  //         type: "object",
  //         properties: {
  //           state: { type: "string" },
  //           procedure_id: { type: "integer" },
  //           group: {
  //             type: "object",
  //             properties: {
  //               id: { type: "string" },
  //               label: { type: "string" }
  //             }
  //           },
  //           created_at: { type: "integer" },
  //           initiated_at: { type: "integer" },
  //           updated_at: { type: "integer" },
  //           received_at: { type: "integer" },
  //           processed_at: { type: "integer" },
  //           instructors_history: {
  //             type: "array",
  //             items: {
  //               type: "string"
  //             }
  //           }
  //         }
  //       },
  //       ds_data: {
  //         type: "object",
  //         properties: {
  //           id: { type: "number" },
  //           state: { type: "string" },
  //           created_at: { type: "string" },
  //           initiated_at: { type: "string" },
  //           received_at: { type: "string" },
  //           processed_at: { type: "string" },
  //           instructeurs: {
  //             type: "array",
  //             items: {
  //               type: "string"
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };
  // }
}

export { DossierRecordModel };
