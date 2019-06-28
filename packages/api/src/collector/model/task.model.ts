export interface Task {
  id?: string;
  procedure_id: number;
  dossier_id: number;
  state: string;
  updated_at: string;
  task_state: "to_complete" | "completed";
  task_completed_date?: string;
  action: "add_or_update" | "delete";
}
