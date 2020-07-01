import { Observable, from } from "rxjs";
import { ProcedureRecord } from "../model";
import { ProcedureRecordModel } from "../database/ProcedureRecordModel";

class ProcedureRepository {
  public add(record: ProcedureRecord): Observable<ProcedureRecord> {
    return from(ProcedureRecordModel.query().insert(record));
  }

  public update(
    recordId: string,
    record: ProcedureRecord
  ): Observable<ProcedureRecord> {
    return from(
      ProcedureRecordModel.query().patchAndFetchById(recordId, record)
    );
  }

  public findByDSKey(dsKey: number): Observable<ProcedureRecord[]> {
    return from(ProcedureRecordModel.query().where({ ds_key: dsKey }));
  }

  public all(): Observable<ProcedureRecord[]> {
    return from(ProcedureRecordModel.query());
  }
}

export const procedureRepository = new ProcedureRepository();
