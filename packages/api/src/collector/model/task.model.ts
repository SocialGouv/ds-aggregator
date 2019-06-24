export interface Task {
  id?: string;
  procedure_id: number;
  dossier_id: number;
  state: string;
  updated_at: Date;
  task_state: "to_complete" | "completed";
  task_completed_date?: Date;
}
