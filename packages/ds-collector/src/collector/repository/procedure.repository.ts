import { Observable } from "rxjs";
import { kintoClient } from "../../lib";
import { DSProcedureRecord } from "../model";


class ProcedureRepository {

    public add(record: DSProcedureRecord): Observable<DSProcedureRecord> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: DSProcedureRecord): Observable<DSProcedureRecord> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<DSProcedureRecord[]> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<DSProcedureRecord[]> {
        return this.collection().all();
    };

    private collection() {
        return kintoClient.collection<DSProcedureRecord>("procedures");
    }

}

export const procedureRepository = new ProcedureRepository();