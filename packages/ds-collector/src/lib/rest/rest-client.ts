
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';
import { logger } from '../../util';

export class RestClient {
    private client: rm.RestClient;
    private api: string;

    constructor(api: string, token?: string, credential?: { login: string, password: string }) {
        this.api = api;
        if (token) {
            const bearer = new handlers.BearerCredentialHandler(token);
            this.client = new rm.RestClient('http-client', api, [bearer], undefined);
        } else if (credential) {
            const credentialHandler = new handlers.BasicCredentialHandler(credential.login, credential.password);
            this.client = new rm.RestClient('http-client', api, [credentialHandler], undefined);
        } else {
            throw new Error("[RestClient] credential or token are required");
        }
    }

    public get<T>(url: string): Observable<T> {
        return from(this.client.get<any>(this.buildResourcePath(url))).pipe(
            map(this.handleResult),
            catchError(this.handleError)
        );
    }

    public create<T>(url: string, data: any): Observable<T> {
        return from(this.client.create<any>(this.buildResourcePath(url), data)).pipe(
            map(this.handleResult),
            catchError(this.handleError)
        );
    }

    public update<T>(url: string, data: any): Observable<T> {
        return from(this.client.update<any>(this.buildResourcePath(url), data)).pipe(
            map(this.handleResult),
            catchError(this.handleError),
        );
    }

    private handleError(error: any): Observable<any> {
        logger.error('[RestClient] error: ', error);
        return of(`[RestClient] error: ${error}`);
    }

    private handleResult(res: rm.IRestResponse<any>) {
        if ([200, 201].includes(res.statusCode)) {
            return res.result;
        }
        throw Error(`[RestClient] http status ${res.statusCode}`);
    }

    private buildResourcePath(url: string) {
        const resourcePath = `${this.api}/${url}`;
        logger.debug(`[rest-client] resource path ${resourcePath}`)
        return resourcePath;
    }
}