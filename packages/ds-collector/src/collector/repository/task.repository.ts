import { NEVER, Observable } from "rxjs";
import { kintoClient, KintoCollection } from "../../lib";
import { Task } from "../model";

class TaskRepository {

    private collection: KintoCollection<Task>;

    constructor() {
        this.collection = kintoClient.collection<Task>("tasks");
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
        return this.collection.search('task_state=to_complete');
    }

}

export const taskRepository = new TaskRepository();