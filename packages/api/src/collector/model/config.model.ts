export type ProcedureGroupType = "introduction" | "autorisation";

export interface ProcedureConfig {
  id?: string;
  procedures: any[];
  group: {
    id: string;
    label: string;
    type: ProcedureGroupType;
  };
}
