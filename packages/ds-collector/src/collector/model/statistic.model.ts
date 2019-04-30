
interface LabelCount {
    count: number,
    label: string
}

interface DossierStatesCount {
    draft: LabelCount;
    initiated: LabelCount;
    received: LabelCount;
    closed: LabelCount;
    refused: LabelCount;
    without_continuation: LabelCount;
}

export interface Statistic {
    result: {
        count: number;
        duration: number;
        status: DossierStatesCount;
        monthly: {
            [month: string]: { // "2019-03"
                count: number;
                duration: number;
                // durations: number[];
                status: DossierStatesCount;
            }
        }
    }
    // daily: {
    //     [day: string]: {
    //         count: number;
    //         duration: number;
    //         durations: number[];
    //         status: DossierStatesCount;
    //     }
    // },
    // processing: {
    //     [day: string]: {
    //         count: number;
    //         duration: number;
    //     }
    // }

}

// Dossiers déposés et acceptés par mois => data.monthly

// Temps de traitement par mois => data.monthly

// Répartition des dossiers par statut => data.status
