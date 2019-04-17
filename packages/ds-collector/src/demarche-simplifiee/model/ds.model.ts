export type procedureState = 'publiee';

export interface DSData {
    id: string;
}

export interface DSProcedure extends DSData {
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

export interface DSDossier extends DSData {

}