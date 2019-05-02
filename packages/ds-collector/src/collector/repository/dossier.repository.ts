import { Observable } from "rxjs";
import { kintoClient } from "../../lib";
import { DossierRecord } from "../model";


class DossierRepository {

    public add(record: DossierRecord): Observable<DossierRecord> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: DossierRecord): Observable<DossierRecord> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<DossierRecord[]> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<DossierRecord[]> {
        return this.collection().all();
    };

    public findAllByProcedureIn(procedureIds: string[]): Observable<DossierRecord[]> {
        return this.collection().search(`in_metadata.procedure_id=${procedureIds}`);
    }

    private collection() {
        return kintoClient.collection<DossierRecord>("dossiers");
    }

}

export const dossierRepository = new DossierRepository();