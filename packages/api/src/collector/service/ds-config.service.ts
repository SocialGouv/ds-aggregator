import { Observable } from "rxjs";
import { ProcedureConfig } from "../model";
import { dsProcedureConfigRepository } from "../repository";

class DSProcedureConfigService {
  public all(): Observable<ProcedureConfig[]> {
    return dsProcedureConfigRepository.all();
  }

  public findByProcedureId(procedureId: number): Observable<ProcedureConfig[]> {
    return dsProcedureConfigRepository.findByProcedureId(procedureId);
  }
}

export const dsProcedureConfigService = new DSProcedureConfigService();
