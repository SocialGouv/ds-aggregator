import { Observable } from "rxjs";
import { KintoCollection } from "../../lib";
import { SynchroHistory } from "../model";
import { kintoClientInstance } from "./kinto-client-instance";

class SynchroHistoryRepository  {

    private collection: KintoCollection<SynchroHistory>

    constructor() {
        this.collection = kintoClientInstance.collection<SynchroHistory>("synchro_histories");
    }

    public all(): Observable<SynchroHistory[]> {
        return this.collection.all();
    }

    public add(synchroHistory: SynchroHistory): Observable<SynchroHistory> {
        return this.collection.add(synchroHistory);
    }

    public update(id: string, synchroHistory: SynchroHistory): Observable<SynchroHistory> {
        return this.collection.update(id, synchroHistory);
    }
}

export const synchroHistoryRepository = new SynchroHistoryRepository();