import { Observable } from "rxjs";
import { kintoClient, KintoCollection } from "../../lib";
import { ProcedureConfig } from "../model";

class DSProcedureConfigRepository {

    private collection: KintoCollection<ProcedureConfig>;

    constructor() {
        this.collection = kintoClient.collection<ProcedureConfig>("ds_configs");
    }

    public all(): Observable<ProcedureConfig[]> {
        return this.collection.all();
    }

    public add(config: ProcedureConfig): Observable<ProcedureConfig> {
        return this.collection.add(config);
    }

}

export const dsProcedureConfigRepository = new DSProcedureConfigRepository();