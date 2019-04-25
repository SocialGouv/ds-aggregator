export interface Task {
    id?: string;
    procedure_id: string;
    dossier_id: string;
    state: string;
    updated_at: Date;
    task_state: 'to_complete' | 'completed';
    task_completed_date?: Date;
}