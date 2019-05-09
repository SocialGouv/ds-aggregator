import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { configuration } from '../../config';
import { RestClient } from '../rest';

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
    private client: RestClient;

    constructor(url: string, login: string, password: string) {
        this.client = new RestClient(url, undefined, { login, password });
        this.apiPath = `/v1/buckets/ds_collector/collections`;
    }

    public collection<T>(collectionName: string): KintoCollection<T> {
        return {
            add: (record: T) => {
                return this.client.create<KintoResult<T>>(`${this.apiPath}/${collectionName}/records`, { data: record }).pipe(
                    map((res: KintoResult<T>) => res.data)
                );
            },
            all: () => {
                return this.client.get<KintoResult<T[]>>(`${this.apiPath}/${collectionName}/records`).pipe(
                    map((res: KintoResult<T[]>) => res.data)
                );
            },
            one: (recordId: string) => {
                return this.client.get<KintoResult<T>>(`${this.apiPath}/${collectionName}/records/${recordId}`).pipe(
                    map((res: KintoResult<T>) => res.data)
                );
            },
            update: (recordId: string, record: T) => {
                return this.client.update<KintoResult<T>>(`${this.apiPath}/${collectionName}/records/${recordId}`, { data: record }).pipe(
                    map((res: KintoResult<T>) => res.data),
                );
            },


            search: (filter: string) => {
                return this.client.get<KintoResult<T[]>>(`${this.apiPath}/${collectionName}/records?${filter}`).pipe(
                    map((res: KintoResult<T[]>) => (res.data) ? res.data : []),
                );
            }
        }
    }
}

const kintoAPI = configuration.kintoAPI || '';
const kintoLogin = configuration.kintoLogin || '';
const kintoPassword = configuration.kintoPassword || '';

export const kintoClient = new KintoClient(kintoAPI, kintoLogin, kintoPassword);