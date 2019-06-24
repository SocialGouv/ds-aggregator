import { IIdentifiable } from "../../util";

export interface LabelCount {
  count: number;
  label: string;
}

export interface DossierStatesCount {
  [state: string]: LabelCount;
}

export interface StatisticBlock {
  count: number;
  duration: number;
  durations: number[];
  status: DossierStatesCount;
}

export interface Statistic extends IIdentifiable {
  id?: string;
  group: {
    id: string;
    label: string;
  };
  count: number;
  duration: number;
  durations: number[];
  status: DossierStatesCount;
  monthly: {
    [month: string]: StatisticBlock;
  };
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

export const initStatistic = (group: { id: string; label: string }) => {
  const block = initStatisticBlock();
  return {
    group,
    // tslint:disable-next-line: object-literal-sort-keys
    ...block,
    monthly: {}
  };
};

export const initStatisticBlock = () => {
  return {
    count: 0,
    duration: 0,
    durations: [],
    status: initDossierStatesCount()
  };
};

const initDossierStatesCount = () => {
  return {
    closed: initLabelCount("accepté"),
    draft: initLabelCount("draft"),
    initiated: initLabelCount("en construction"),
    received: initLabelCount("en instruction"),
    refused: initLabelCount("refusé"),
    without_continuation: initLabelCount("classé sans suite")
  };
};

const initLabelCount = (label: string) => {
  return {
    count: 0,
    label
  };
};
