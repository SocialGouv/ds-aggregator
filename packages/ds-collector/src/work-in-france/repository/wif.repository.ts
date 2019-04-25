import { Observable } from "rxjs";
import { DSData, DSDossier, DSProcedure } from "../../demarche-simplifiee";
import { kintoClient } from "../../lib";
import { WIFRecord } from "../model";



export interface IWorkInFranceRepository<S extends DSData> {
    add: (record: WIFRecord<S>) => Observable<WIFRecord<S>>;
    update: (recordId: string, record: WIFRecord<S>) => Observable<WIFRecord<S>>;
    findByDSKey: (dsKey: string) => Observable<Array<WIFRecord<S>>>;
    all: () => Observable<Array<WIFRecord<S>>>;
}

class WorkInFranceRepository<S extends DSData,> implements IWorkInFranceRepository<S> {


    private collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    public add(record: WIFRecord<S>): Observable<WIFRecord<S>> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: WIFRecord<S>): Observable<WIFRecord<S>> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<Array<WIFRecord<S>>> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<Array<WIFRecord<S>>> {
        return this.collection().all();
    };

    private collection() {
        return kintoClient.collection<WIFRecord<S>>(this.collectionName);
    }

}

export const wifProcedureRepository = new WorkInFranceRepository<DSProcedure>('procedures');

export const wifDossierRepository = new WorkInFranceRepository<DSDossier>('dossiers');