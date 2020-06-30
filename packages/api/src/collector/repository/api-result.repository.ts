import { Observable, from } from "rxjs";
import { APIResult } from "../model/api-result.model";
import { APIResultModel } from "../database/APIResultModel";

class APIResultRepository {
  public update(apiResult: APIResult): Observable<APIResult> {
    return from(
      APIResultModel.query().patchAndFetchById(apiResult.id || "0", apiResult)
    );
  }

  public findAllByProcedure(procedureId: number): Observable<APIResult> {
    return from(
      APIResultModel.query()
        .where({ procedure: procedureId })
        .then(async (res: APIResultModel[]) => {
          let result;
          if (res.length === 0) {
            const entity = {
              actions: [],
              items: [],
              procedure: procedureId
            };
            result = await APIResultModel.query().insert(entity);
          } else {
            result = res[0];
          }
          return result;
        })
    );
  }
}

export const apiResultRepository = new APIResultRepository();
