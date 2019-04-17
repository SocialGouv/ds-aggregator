import { Observable } from "rxjs";
import { DSData, DSProcedure } from "../../demarche-simplifiee";
import { KintoClient, kintoClient } from "../../lib";
import { configuration } from "../../util";
import { WIFRecord } from "../model";



export interface IWorkInFranceRepository<S extends DSData> {
    add: (record: WIFRecord<S>) => Observable<WIFRecord<S>>;
    update: (recordId: string, record: WIFRecord<S>) => Observable<WIFRecord<S>>;
    findByDSKey: (dsKey: string) => Observable<WIFRecord<S>[]>;
    all: () => Observable<WIFRecord<S>[]>;
}

class WorkInFranceRepository<S extends DSData,> implements IWorkInFranceRepository<S> {

    private kintoAPI = configuration.kintoAPI || '';
    private kintoLogin = configuration.kintoLogin || '';
    private kintoPassword = configuration.kintoPassword || '';
    private collectionName: string;
    private client: KintoClient;

    constructor(collectionName: string) {
        this.client = kintoClient(this.kintoAPI, this.kintoLogin, this.kintoPassword);
        this.collectionName = collectionName;
    }

    public add(record: WIFRecord<S>): Observable<WIFRecord<S>> {
        return this.collection().add(record);
    };

    public update(recordId: string, record: WIFRecord<S>): Observable<WIFRecord<S>> {
        return this.collection().update(recordId, record);
    };

    public findByDSKey(dsKey: string): Observable<WIFRecord<S>[]> {
        return this.collection().search(`ds_key=${dsKey}`);
    };

    public all(): Observable<WIFRecord<S>[]> {
        return this.collection().all();
    };

    private collection() {
        return this.client.collection<WIFRecord<S>>(this.collectionName);
    }

}

export const wifProcedureRepository = new WorkInFranceRepository<DSProcedure>('procedures');