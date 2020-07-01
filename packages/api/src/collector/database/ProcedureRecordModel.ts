import { Model } from "objection";
import { ProcedureRecord } from "../model/record.model";
import { DSProcedure } from "../../demarche-simplifiee";

class ProcedureRecordModel extends Model implements ProcedureRecord {
  id?: string;
  ds_key: number = 0;
  ds_data: DSProcedure = {
    id: 0,
    label: "",
    description: "",
    organisation: "",
    direction: "",
    archived_at: "",
    total_dossier: 0,
    link: "",
    state: "publiee",
    types_de_champ: []
  };

  static get tableName() {
    return "procedure_record";
  }

  static get idColumn() {
    return "id";
  }
}

export { ProcedureRecordModel };
