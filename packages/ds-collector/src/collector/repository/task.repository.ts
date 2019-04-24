import { Observable } from "rxjs";
import { kintoClient, KintoCollection } from "../../lib";
import { configuration } from "../../util";
import { Task } from "../model";

class TaskRepository {

    private collection: KintoCollection<Task>;

    constructor() {
        const kintoAPI = configuration.kintoAPI || '';
        const kintoLogin = configuration.kintoLogin || '';
        const kintoPassword = configuration.kintoPassword || '';
        const client = kintoClient(kintoAPI, kintoLogin, kintoPassword);
        this.collection = client.collection<Task>("tasks");
    }

    public add(task: Task): Observable<Task> {
        return this.collection.add(task);
    }

}

export const taskRepository = new TaskRepository();