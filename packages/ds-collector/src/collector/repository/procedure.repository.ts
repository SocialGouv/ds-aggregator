import { Observable } from "rxjs";
import { kintoClient } from "../../lib";
import { ProcedureRecord } from "../model";


class ProcedureRepository {

    public add(record: ProcedureRecord): Observable<ProcedureRecord> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: ProcedureRecord): Observable<ProcedureRecord> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<ProcedureRecord[]> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<ProcedureRecord[]> {
        return this.collection().all();
    };

    private collection() {
        return kintoClient.collection<ProcedureRecord>("procedures");
    }

}

export const procedureRepository = new ProcedureRepository();