import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';

interface KintoResult<T> {
    data: T[];
}

interface KintoCollection<T> {

    add(record: T): Observable<T>;

    update(recordId: string, record: T): Observable<T>;

    one(id: string): Observable<T>;

    all(): Observable<T[]>;

    search(filter: string): Observable<T[]>;
}


export class KintoClient {

    private url: string;
    private login: string;
    private password: string;
    private client: rm.RestClient;

    constructor(url: string, login: string, password: string) {
        this.url = url;
        this.login = login;
        this.password = password;
        const credential = new handlers.BasicCredentialHandler(this.login, this.password);
        this.client = new rm.RestClient('kinto-api', this.url, [credential], undefined);
        this.url = `/v1/buckets/ds_collector/collections`;
    }

    collection<T>(collectionName: string): KintoCollection<T> {
        return {
            add: (record: T) => {
                return from(this.client.create<T>(`${this.url}/${collectionName}/records`, { data: record })).pipe(
                    map(this.handleResult<T>())
                );
            },
            update: (recordId: string, record: T) => {
                return from(this.client.update<T>(`${this.url}/${collectionName}/records/${recordId}`, { data: record })).pipe(
                    map(this.handleResult<T>())
                );
            },
            one: (recordId: string) => {
                return from(this.client.get<T>(`${this.url}/${collectionName}/records/${recordId}`)).pipe(
                    map(this.handleResult<T>())
                );
            },
            all: () => {
                return from(this.client.get<T[]>(`${this.url}/${collectionName}/records`)).pipe(
                    map(this.handleResult<T[]>())
                );
            },
            search: (filter: string) => {
                return from(this.client.get<KintoResult<T>>(`${this.url}/${collectionName}/records?${filter}`)).pipe(
                    map(this.handleResult<KintoResult<T>>()),
                    map((res: KintoResult<T>) => res.data),
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

export const kintoClient = (url: string, login: string, password: string) => new KintoClient(url, login, password);