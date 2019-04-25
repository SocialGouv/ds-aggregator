import { Observable } from "rxjs";
import { Task } from "../model";
import { taskRepository } from "../repository";

class DSCollectorService {

    public addTask(procedureId: string, dossierId: string, state: string, updatedAt: Date): Observable<Task> {
        const task: Task = {
            dossier_id: dossierId,
            procedure_id: procedureId,
            state,
            task_state: 'to_complete',
            updated_at: updatedAt,

        }
        return taskRepository.add(task);
    }

    public getTasksToComplete(): Observable<Task[]> {
        return taskRepository.getTaskToComplete();
    }

    public markAsCompleted(task: Task): Observable<Task> {
        task.task_completed_date = new Date();
        task.task_state = 'completed';
        return taskRepository.update(task);
    }

}

export const collectorService = new DSCollectorService();







