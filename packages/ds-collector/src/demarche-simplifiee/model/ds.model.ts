import { IIdentifiable } from "../../util";

export type procedureState = 'publiee';

// state: correspond à l'état du dossier
// initiated: en construction
// received: en instruction
// closed: accepté
// refused: refusé
// without_continuation: classé sans suite
export type DossierStateType = 'draft' | 'initiated' | 'received' | 'closed' | 'refused' | 'without_continuation';

// id: numéro du dossier
// archived: informe si le dossier est archive (true) ou non (false)
// email: email de l'usager
// motivation: motivation de la décision 
// email_insructeurs: email de l'instructeur qui a donné la décision pour le dossier


export interface DSProcedure extends IIdentifiable {
    label: string;
    description: string;
    organisation: string;
    direction: string;
    archived_at: string;
    geographic_information: DSGeographicInformation;
    total_dossier: number;
    link: string;
    state: procedureState;
    types_de_champ: DSTypeChamp[];
    // "types_de_champ_private": [],
    // "types_de_piece_justificative": []

}

export interface DSGeographicInformation {
    use_api_carto: boolean;
    quartiers_prioritaires: boolean;
    cadastre: boolean;
}

export interface DSTypeChamp {
    id: number;
    libelle: string;
    type_champ: string;
    order_place: number;
    description: string;
}

export interface DSDossierItem extends IIdentifiable {
    nom_projet: string;
    updated_at: string;
    initiated_at: string;
    state: DossierStateType;
}

export interface DSDossier extends IIdentifiable {
    state: DossierStateType;
    created_at: string;
    updated_at: string;
    initiated_at: string;
    received_at: string;
    processed_at: string;
}