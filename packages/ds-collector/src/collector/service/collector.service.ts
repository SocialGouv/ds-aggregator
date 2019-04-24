import { Observable } from "rxjs";
import { Task } from "../model";
import { taskRepository } from "../repository";

class DSCollectorService {

    public addTask(procedureId: number, dossierId: number, state: string, updatedAt: Date): Observable<Task> {
        const task: Task = {
            dossier_id: dossierId,
            procedure_id: procedureId,
            state,
            updated_at: updatedAt
        }
        return taskRepository.add(task);
    }

}

export const collectorService = new DSCollectorService();







