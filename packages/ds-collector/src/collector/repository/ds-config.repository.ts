import { Observable } from "rxjs";
import { KintoCollection } from "../../lib";
import { ProcedureConfig } from "../model";
import { kintoClientInstance } from "./kinto-client-instance";

class DSProcedureConfigRepository {

    private collection: KintoCollection<ProcedureConfig>;

    constructor() {
        this.collection = kintoClientInstance.collection<ProcedureConfig>("ds_configs");
    }

    public all(): Observable<ProcedureConfig[]> {
        return this.collection.all();
    }

    public search(filter: string): Observable<ProcedureConfig[]> {
        return this.collection.search(filter);
    }

    public add(config: ProcedureConfig): Observable<ProcedureConfig> {
        return this.collection.add(config);
    }

}

export const dsProcedureConfigRepository = new DSProcedureConfigRepository();