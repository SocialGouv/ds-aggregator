import { Observable } from "rxjs";
import { kintoClient } from "../../lib";
import { DSDossierRecord } from "../model";


class DossierRepository {

    public add(record: DSDossierRecord): Observable<DSDossierRecord> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: DSDossierRecord): Observable<DSDossierRecord> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<DSDossierRecord[]> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<DSDossierRecord[]> {
        return this.collection().all();
    };

    private collection() {
        return kintoClient.collection<DSDossierRecord>("dossiers");
    }

}

export const dossierRepository = new DossierRepository();