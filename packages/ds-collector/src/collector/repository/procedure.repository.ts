import { Observable } from "rxjs";
import { DSRecord } from "..";
import { DSDossier, DSProcedure } from "../../demarche-simplifiee";
import { kintoClient } from "../../lib";
import { IIdentifiable } from "../../util";


class DSBaseRepository<S extends IIdentifiable>  {

    private collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    public add(record: DSRecord<S>): Observable<DSRecord<S>> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: DSRecord<S>): Observable<DSRecord<S>> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<Array<DSRecord<S>>> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<Array<DSRecord<S>>> {
        return this.collection().all();
    };

    private collection() {
        return kintoClient.collection<DSRecord<S>>(this.collectionName);
    }

}

export const procedureRepository = new DSBaseRepository<DSProcedure>('procedures');

export const dossierRepository = new DSBaseRepository<DSDossier>('dossiers');