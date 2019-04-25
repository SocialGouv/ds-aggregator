import { Observable } from "rxjs";
import { CollectorRecord } from "..";
import { DSData, DSDossier, DSProcedure } from "../../demarche-simplifiee";
import { kintoClient } from "../../lib";

export interface IRepository<S extends DSData> {
    add: (record: CollectorRecord<S>) => Observable<CollectorRecord<S>>;
    update: (recordId: string, record: CollectorRecord<S>) => Observable<CollectorRecord<S>>;
    findByDSKey: (dsKey: string) => Observable<Array<CollectorRecord<S>>>;
    all: () => Observable<Array<CollectorRecord<S>>>;
}

class CollectorRepository<S extends DSData,> implements IRepository<S> {


    private collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    public add(record: CollectorRecord<S>): Observable<CollectorRecord<S>> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: CollectorRecord<S>): Observable<CollectorRecord<S>> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<Array<CollectorRecord<S>>> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<Array<CollectorRecord<S>>> {
        return this.collection().all();
    };

    private collection() {
        return kintoClient.collection<CollectorRecord<S>>(this.collectionName);
    }

}

export const procedureRepository = new CollectorRepository<DSProcedure>('procedures');

export const dossierRepository = new CollectorRepository<DSDossier>('dossiers');