import { Observable } from "rxjs";
import { ProcedureRecord } from "../model";
import { kintoClientInstance } from "./kinto-client-instance";

class ProcedureRepository {
  public add(record: ProcedureRecord): Observable<ProcedureRecord> {
    return this.collection().add(record);
  }

  public update(
    recordId: string,
    record: ProcedureRecord
  ): Observable<ProcedureRecord> {
    return this.collection().update(recordId, record);
  }

  public findByDSKey(dsKey: number): Observable<ProcedureRecord[]> {
    return this.collection().search(`ds_key=${dsKey}`);
  }

  public all(): Observable<ProcedureRecord[]> {
    return this.collection().all();
  }

  private collection() {
    return kintoClientInstance.collection<ProcedureRecord>("procedures");
  }
}

export const procedureRepository = new ProcedureRepository();
