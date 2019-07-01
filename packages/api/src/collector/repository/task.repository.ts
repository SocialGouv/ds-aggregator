import { NEVER, Observable } from "rxjs";
import { KintoCollection } from "../../lib";
import { Task } from "../model";
import { kintoClientInstance } from "./kinto-client-instance";

class TaskRepository {
  private collection: KintoCollection<Task>;

  constructor() {
    this.collection = kintoClientInstance.collection<Task>("tasks");
  }

  public add(task: Task): Observable<Task> {
    return this.collection.add(task);
  }

  public update(task: Task): Observable<Task> {
    if (task.id == null) {
      return NEVER;
    }
    return this.collection.update(task.id, task);
  }

  public getTaskToComplete(): Observable<Task[]> {
    return this.collection.search("task_state=to_complete&_sort=last_modified");
  }
}

export const taskRepository = new TaskRepository();
