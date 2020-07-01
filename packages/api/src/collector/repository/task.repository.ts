import { Observable, from } from "rxjs";
import { Task } from "../model";
import { TaskModel } from "../database/TaskModel";

class TaskRepository {
  public add(task: Task): Observable<Task> {
    return from(TaskModel.query().insert(task));
  }

  public delete(task: Task): Observable<number> {
    const taskId = task.id || "";
    return from(TaskModel.query().deleteById(taskId));
  }

  public getTaskToComplete(): Observable<Task[]> {
    return from(TaskModel.query());
  }
}

export const taskRepository = new TaskRepository();
