import { Observable, from } from "rxjs";
import { ProcedureConfig } from "../model";
import { ProcedureConfigModel } from "../database/ProcedureConfigModel";

class DSProcedureConfigRepository {
  public all(): Observable<ProcedureConfig[]> {
    return from(ProcedureConfigModel.query());
  }

  public findByProcedureId(procedureId: number): Observable<ProcedureConfig[]> {
    return from(
      ProcedureConfigModel.query().whereRaw(`${procedureId} = ANY (procedures)`)
    );
  }

  public add(config: ProcedureConfig): Observable<ProcedureConfig> {
    return from(ProcedureConfigModel.query().insert(config));
  }

  public delete(): Observable<number> {
    return from(ProcedureConfigModel.query().delete());
  }
}

export const dsProcedureConfigRepository = new DSProcedureConfigRepository();
