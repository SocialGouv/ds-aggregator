import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

    private client: RestClient;

    constructor(url: string, login: string, password: string) {
        this.client = new RestClient(url, undefined, { login, password });
    }

    public collection<T>(collectionName: string): KintoCollection<T> {
        return {
            add: (record: T) => {
                return this.client.create<KintoResult<T>>(`${collectionName}/records`, { data: record }).pipe(
                    map((res: KintoResult<T>) => res.data)
                );
            },
            all: () => {
                return this.client.get<KintoResult<T[]>>(`${collectionName}/records`).pipe(
                    map((res: KintoResult<T[]>) => res.data)
                );
            },
            one: (recordId: string) => {
                return this.client.get<KintoResult<T>>(`${collectionName}/records/${recordId}`).pipe(
                    map((res: KintoResult<T>) => res.data)
                );
            },
            update: (recordId: string, record: T) => {
                return this.client.update<KintoResult<T>>(`${collectionName}/records/${recordId}`, { data: record }).pipe(
                    map((res: KintoResult<T>) => res.data),
                );
            },


            search: (filter: string) => {
                return this.client.get<KintoResult<T[]>>(`${collectionName}/records?${filter}`).pipe(
                    map((res: KintoResult<T[]>) => (res.data) ? res.data : []),
                );
            }
        }
    }
}

export const kintoClient = (api: string, login: string, password: string) => new KintoClient(api, login, password);