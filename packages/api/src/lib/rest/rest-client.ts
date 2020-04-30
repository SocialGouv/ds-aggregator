import { from, Observable, throwError } from "rxjs";
import { catchError, map, finalize } from "rxjs/operators";
import * as handlers from "typed-rest-client/Handlers";
import * as rm from "typed-rest-client/RestClient";
import { logger } from "../../util";
import { Http404Error } from "./http-error";

export class RestClient {
  private client: rm.RestClient;
  private api: string;

  constructor(
    api: string,
    token?: string,
    credential?: { login: string; password: string }
  ) {
    this.api = api;
    if (token) {
      const bearer = new handlers.BearerCredentialHandler(token);
      this.client = new rm.RestClient("http-client", api, [bearer], undefined);
    } else if (credential) {
      const credentialHandler = new handlers.BasicCredentialHandler(
        credential.login,
        credential.password
      );
      this.client = new rm.RestClient(
        "http-client",
        api,
        [credentialHandler],
        undefined
      );
    } else {
      throw new Error("[RestClient] credential or token are required");
    }
  }

  public get<T>(url: string): Observable<T> {
    const _url = this.buildResourcePath(url);
    const profiler = logger.startTimer();
    return from(this.client.get<any>(_url)).pipe(
      map(this.handleResult),
      finalize(() => profiler.done({ message: `[GET] -> ${_url}` })),
      catchError((err: Error) => this.handleError(err, `GET ${url}`))
    );
  }

  public create<T>(url: string, data: any): Observable<T> {
    const _url = this.buildResourcePath(url);
    const profiler = logger.startTimer();
    return from(this.client.create<any>(_url, data)).pipe(
      map(this.handleResult),
      finalize(() => profiler.done({ message: `[CREATE] -> ${_url}`, data })),
      catchError((err: Error) => this.handleError(err, `CREATE ${url}`))
    );
  }

  public update<T>(url: string, data: any): Observable<T> {
    const _url = this.buildResourcePath(url);
    const profiler = logger.startTimer();
    return from(this.client.update<any>(_url, data)).pipe(
      map(this.handleResult),
      finalize(() => profiler.done({ message: `[UPDATE] -> ${_url}`, data })),
      catchError((err: Error) => this.handleError(err, `UPDATE ${url}`))
    );
  }

  public delete<T>(url: string): Observable<T> {
    const _url = this.buildResourcePath(url);
    const profiler = logger.startTimer();
    return from(this.client.del<any>(_url)).pipe(
      map(this.handleResult),
      finalize(() => profiler.done({ message: `[DELETE] -> ${_url}` })),
      catchError((err: Error) => this.handleError(err, `DELETE ${url}`))
    );
  }

  private handleError(error: any, url: string): Observable<any> {
    logger.error(`[RestClient] ${url}: `, error);
    return throwError(error);
  }

  private handleResult(res: rm.IRestResponse<any>) {
    if ([200, 201].includes(res.statusCode)) {
      return res.result;
    }
    if (res.statusCode === 404) {
      throw new Http404Error();
    }
    throw Error(`[RestClient] http status ${res.statusCode}`);
  }

  private buildResourcePath(url: string) {
    const resourcePath = `${this.api}/${url}`;
    logger.debug(`[RestClient] resource path ${resourcePath}`);
    return resourcePath;
  }
}
