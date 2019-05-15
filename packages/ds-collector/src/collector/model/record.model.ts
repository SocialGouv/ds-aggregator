import { DossierStateType, DSDossier, DSProcedure } from "../../demarche-simplifiee";
import { IIdentifiable } from "../../util";

export interface Record<T extends IIdentifiable> {
    id?: string;
    ds_key: string;
    ds_data: T;
}

// tslint:disable-next-line: no-empty-interface
export interface ProcedureRecord extends Record<DSProcedure> {
}

export interface DossierRecord extends Record<DSDossier> {
    metadata: {
        state: DossierStateType;
        procedure_id: string;
        group: {
            id: string;
            label: string;
        },
        created_at: number;
        // date de depot du dossier
        initiated_at: number | null;
        // date de la dernière modification du dossier
        updated_at: number | null;
        // date du passage en instruction
        received_at: number | null;
        // date de décision du dossier
        processed_at: number | null;
    }
}

// id: numéro du dossier
// archived: informe si le dossier est archive (true) ou non (false)
// email: email de l'usager
// motivation: motivation de la décision 
// email_insructeurs: email de l'instructeur qui a donné la décision pour le dossier