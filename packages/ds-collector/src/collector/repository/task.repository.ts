import { Observable } from "rxjs";
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

}

export const taskRepository = new TaskRepository();