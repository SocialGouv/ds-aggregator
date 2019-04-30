import { DossierStateType, DSDossier, DSProcedure } from "../../demarche-simplifiee";
import { IIdentifiable } from "../../util";

export interface DSRecord<T extends IIdentifiable> {
    id?: string;
    ds_key: string;
    ds_data: T;
}

// tslint:disable-next-line: no-empty-interface
export interface DSProcedureRecord extends DSRecord<DSProcedure> {
}

export interface DSDossierRecord extends DSRecord<DSDossier> {
    metadata: {
        state: DossierStateType;
        created_at: number | null;
        // date de la dernière modification du dossier
        updated_at?: number | null;
        // date du passage en instruction
        received_at?: number | null;
        // date de décision du dossier
        processed_at?: number | null;
    }
}

// id: numéro du dossier
// archived: informe si le dossier est archive (true) ou non (false)
// email: email de l'usager
// motivation: motivation de la décision 
// email_insructeurs: email de l'instructeur qui a donné la décision pour le dossier