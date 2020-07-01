export interface Task {
  id?: string;
  procedure_id: number;
  dossier_id: number;
  state: string;
  updated_at: string;
  action: "add_or_update" | "delete";
}
