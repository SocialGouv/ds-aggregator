import { Observable } from "rxjs";
import { kintoClient, KintoCollection } from "../../lib";
import { DSProcedureConfig } from "../model";

class DSProcedureConfigRepository {

    private collection: KintoCollection<DSProcedureConfig>;

    constructor() {
        this.collection = kintoClient.collection<DSProcedureConfig>("ds_configs");
    }

    public all(): Observable<DSProcedureConfig[]> {
        return this.collection.all();
    }

    public add(config: DSProcedureConfig): Observable<DSProcedureConfig> {
        return this.collection.add(config);
    }

}

export const dsProcedureConfigRepository = new DSProcedureConfigRepository();