import { Model } from "objection";
import {
  Statistic,
  DossierStatesCount,
  StatisticBlock,
  ProcedureGroupType,
} from "../model";

class StatisticModel extends Model implements Statistic {
  id?: string;
  group: {
    id: string;
    label: string;
    type: ProcedureGroupType;
  } = {
    id: "",
    label: "",
    type: "autorisation",
  };
  count: number = 0;
  duration: number = 0;
  durations: number[] = [];
  status: DossierStatesCount = {};
  monthly: {
    [month: string]: StatisticBlock;
  } = {};

  static get tableName() {
    return "statistic";
  }

  static get idColumn() {
    return "id";
  }
}

export { StatisticModel };
