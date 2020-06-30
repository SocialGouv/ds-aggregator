import { Observable, from } from "rxjs";
import { DeletedData } from "../../lib";
import { Task } from "../model";
import { TaskModel } from "../database/TaskModel";

class TaskRepository {
  constructor() {}

  public add(task: Task): Observable<Task> {
    return from(TaskModel.query().insert(task));
  }

  public delete(task: Task): Observable<DeletedData[]> {
    const taskId = task.id || "";
    return from(
      TaskModel.query()
        .deleteById(taskId)
        .then(() => {
          return [
            {
              id: taskId,
              deleted: true,
              last_modifified: ""
            }
          ];
        })
    );
  }

  public getTaskToComplete(): Observable<Task[]> {
    return from(TaskModel.query());
  }
}

export const taskRepository = new TaskRepository();
