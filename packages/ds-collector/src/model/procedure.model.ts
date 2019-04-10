export type procedureState = 'publiee';

export interface Procedure {

    label: string;
    id: number;
    description: string;
    organisation: string;
    direction: string;
    archived_at: Date;
    geographic_information: GeographicInformation;
    total_dossier: number;
    link: string;
    state: procedureState;
    types_de_champ: TypeChamp[];
    // "types_de_champ_private": [],
    // "types_de_piece_justificative": []

}

export interface GeographicInformation {
    use_api_carto: boolean;
    quartiers_prioritaires: boolean;
    cadastre: boolean;
}

export interface TypeChamp {
    id: number;
    libelle: string;
    type_champ: string;
    order_place: number;
    description: string;
}