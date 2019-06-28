import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { KintoCollection } from "../../lib";
import { APIResult } from "../model/api-result.model";
import { kintoClientInstance } from "./kinto-client-instance";

class APIResultRepository {
  private collection: KintoCollection<APIResult>;

  constructor() {
    this.collection = kintoClientInstance.collection<APIResult>("api_results");
  }

  public update(apiResult: APIResult): Observable<APIResult> {
    return this.collection.update(apiResult.id || "0", apiResult);
  }

  public findAllByProcedure(procedureId: number): Observable<APIResult> {
    return this.collection.search(`procedure=${procedureId}`).pipe(
      mergeMap((apiResult: APIResult[]) => {
        if (apiResult.length === 0) {
          return this.collection.add({
            actions: [],
            items: [],
            procedure: procedureId
          });
        } else {
          return of(apiResult[0]);
        }
      })
    );
  }
}

export const apiResultRepository = new APIResultRepository();
