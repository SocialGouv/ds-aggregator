import {
  DossierStateType,
  DSDossier,
  DSProcedure,
} from "../../demarche-simplifiee";
import { IIdentifiable } from "../../util";

export interface Record<T extends IIdentifiable> {
  id?: string;
  ds_data: T;
  processed_at?: Date;
  last_modified?: Date;
  state?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface ProcedureRecord extends Record<DSProcedure> {
  ds_key: number;
}

export interface DossierRecordMetadata {
  state: DossierStateType;
  procedure_id: number;
  group: {
    id: string;
    label: string;
  };
  created_at: number;
  // date de depot du dossier
  initiated_at: number | null;
  // date de la dernière modification du dossier
  updated_at: number | null;
  // date du passage en instruction
  received_at: number | null;
  // date de décision du dossier
  processed_at: number | null;
  instructors_history: string[];
}

export interface DossierRecord extends Record<DSDossier> {
  ds_key: string;
  metadata: DossierRecordMetadata;
  procedure_id: number;
  created_at: Date;
}

// id: numéro du dossier
// archived: informe si le dossier est archive (true) ou non (false)
// email: email de l'usager
// motivation: motivation de la décision
// email_insructeurs: email de l'instructeur qui a donné la décision pour le dossier
