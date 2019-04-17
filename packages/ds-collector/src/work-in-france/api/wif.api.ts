import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';
import { DSData, DSProcedure } from "../../demarche-simplifiee";
import { configuration } from "../../util";
import { WIFRecord } from "../model";

interface KintoFilterResult<T> {
    data: T[];
}

export interface IWorkInFranceRepository<S extends DSData> {
    add: (record: WIFRecord<S>) => Observable<WIFRecord<S> | null>;
    update: (record: WIFRecord<S>) => Observable<WIFRecord<S> | null>;
    findByDSKey: (record: WIFRecord<S>) => Observable<WIFRecord<S> | null>;
    all: () => Observable<WIFRecord<S>[] | null>;
}

class WorkInFranceRepository<S extends DSData,> implements IWorkInFranceRepository<S> {

    private kintoAPI = configuration.kintoAPI;
    private kintoLogin = configuration.kintoLogin || '';
    private kintoPassword = configuration.kintoPassword || '';
    private client: rm.RestClient;
    private url: string;

    constructor(collectionName: string) {
        const credential = new handlers.BasicCredentialHandler(this.kintoLogin, this.kintoPassword);
        this.client = new rm.RestClient('kinto-api', this.kintoAPI, [credential], undefined);
        this.url = `/v1/buckets/ds_collector/collections/${collectionName}/records`;
    }

    public add(record: WIFRecord<S>): Observable<WIFRecord<S> | null> {
        return from(this.client.create<WIFRecord<S>>(this.url, { data: record })).pipe(
            map((res) => res.result)
        );
    };

    public update(record: WIFRecord<S>): Observable<WIFRecord<S> | null> {
        return from(this.client.update<WIFRecord<S>>(`${this.url}/${record.id}`, { data: record })).pipe(
            map((res) => res.result)
        );
    };

    public findByDSKey(record: WIFRecord<S>): Observable<WIFRecord<S> | null> {
        return from(this.client.get<KintoFilterResult<WIFRecord<S>>>(`${this.url}?ds_key=${record.ds_key}`)).pipe(
            map((res) => {
                if (!res.result) {
                    return null;
                }
                if (res.result.data.length === 0) {
                    return null;
                }
                return res.result.data[0];
            })
        );
    };

    public all(): Observable<WIFRecord<S>[] | null> {
        return from(this.client.get<WIFRecord<S>[]>(this.url)).pipe(
            map((res) => res.result)
        );
    };

}

export const wifProcedureRepository = new WorkInFranceRepository<DSProcedure>('procedures');