import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';
import { configuration, logger } from '../../util';

interface KintoResult<T> {
    data: T;
}

export interface KintoCollection<T> {

    add(record: T): Observable<T>;

    update(recordId: string, record: T): Observable<T>;

    one(id: string): Observable<T>;

    all(): Observable<T[]>;

    search(filter: string): Observable<T[]>;
}


class KintoClient {

    private apiPath: string;
    private client: rm.RestClient;

    constructor(url: string, login: string, password: string) {
        const credential = new handlers.BasicCredentialHandler(login, password);
        this.client = new rm.RestClient('kinto-api', url, [credential], undefined);
        this.apiPath = `/v1/buckets/ds_collector/collections`;
    }

    public collection<T>(collectionName: string): KintoCollection<T> {
        return {
            add: (record: T) => {
                return from(this.client.create<KintoResult<T>>(`${this.apiPath}/${collectionName}/records`, { data: record })).pipe(
                    tap((res: any) => logger.debug(`[KintoClient.collection.add] RESULT:`, res)),
                    map(this.handleResult<KintoResult<T>>()),
                    map((res: KintoResult<T>) => res.data),
                );
            },
            all: () => {
                return from(this.client.get<T[]>(`${this.apiPath}/${collectionName}/records`)).pipe(
                    tap((res: any) => logger.debug(`[KintoClient.collection.all] RESULT:`, res)),
                    map(this.handleResult<T[]>())
                );
            },
            one: (recordId: string) => {
                return from(this.client.get<T>(`${this.apiPath}/${collectionName}/records/${recordId}`)).pipe(
                    tap((res: any) => logger.debug(`[KintoClient.collection.one] RESULT:`, res)),
                    map(this.handleResult<T>())
                );
            },
            update: (recordId: string, record: T) => {
                return from(this.client.update<KintoResult<T>>(`${this.apiPath}/${collectionName}/records/${recordId}`, { data: record })).pipe(
                    tap((res: any) => logger.debug(`[KintoClient.collection.update] RESULT:`, res)),
                    map(this.handleResult<KintoResult<T>>()),
                    map((res: KintoResult<T>) => res.data),
                );
            },


            search: (filter: string) => {
                return from(this.client.get<KintoResult<T[]>>(`${this.apiPath}/${collectionName}/records?${filter}`)).pipe(
                    tap((res: any) => logger.debug(`[KintoClient.collection.all] RESULT:`, res)),
                    map(this.handleResult<KintoResult<T[]>>()),
                    map((res: KintoResult<T[]>) => res.data),
                );
            }
        }
    }

    private handleResult<T>(): (value: rm.IRestResponse<T>) => T {
        return (res: rm.IRestResponse<T>) => {
            if (res.result) {
                return res.result;
            }
            throw new Error("[KintoClient] request result is null");
        };
    }
}

const kintoAPI = configuration.kintoAPI || '';
const kintoLogin = configuration.kintoLogin || '';
const kintoPassword = configuration.kintoPassword || '';

export const kintoClient = new KintoClient(kintoAPI, kintoLogin, kintoPassword);