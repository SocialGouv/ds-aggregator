import { Observable } from "rxjs";
import { logger } from "../../util";
import { Task } from "../model";
import { taskRepository } from "../repository";

class TaskService {
  public addTask(
    action: "add_or_update" | "delete",
    procedureId: number,
    dossierId: number,
    state: string,
    updatedAt: string
  ): Observable<Task> {
    const task: Task = {
      action,
      dossier_id: dossierId,
      procedure_id: procedureId,
      state,
      task_state: "to_complete",
      updated_at: updatedAt
    };
    logger.info(
      `[TaskService] new task ${procedureId}-${dossierId} (${action})`
    );
    return taskRepository.add(task);
  }

  public getTasksToComplete(): Observable<Task[]> {
    return taskRepository.getTaskToComplete();
  }

  public markAsCompleted(task: Task): Observable<Task> {
    logger.info(
      `[TaskService] task ${task.procedure_id}-${task.dossier_id} ${task.action} completed`
    );
    task.task_completed_date = new Date().toISOString();
    task.task_state = "completed";
    return taskRepository.update(task);
  }

  public delete(task: Task): any {
    logger.info(
      `[TaskService] task ${task.procedure_id}-${task.dossier_id} ${task.action} completed (deleted)`
    );
    return taskRepository.delete(task);
  }
}

export const taskService = new TaskService();
