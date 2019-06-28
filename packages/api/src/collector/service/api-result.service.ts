import { Observable } from "rxjs";
import { APIResult } from "../model/api-result.model";
import { apiResultRepository } from "../repository";

class APIResultService {
  public findByProcedureId(procedureId: number): Observable<APIResult> {
    return apiResultRepository.findAllByProcedure(procedureId);
  }

  public update(apiResult: APIResult): Observable<APIResult> {
    return apiResultRepository.update(apiResult);
  }
}

export const apiResultService = new APIResultService();
