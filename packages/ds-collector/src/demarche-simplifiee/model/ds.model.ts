import { IIdentifiable } from "../../util";

export type procedureState = 'publiee';

export type dossierState = 'initiated' | 'closed' | 'without_continuation';


export interface DSProcedure extends IIdentifiable {
    label: string;
    description: string;
    organisation: string;
    direction: string;
    archived_at: Date;
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
    updated_at: Date;
    initiated_at: Date;
    state: dossierState;
}

export interface DSDossier extends IIdentifiable {
    created_at: Date,
    updated_at: Date,
    initiated_at: Date
}