import { Observable, from } from "rxjs";
import { DossierRecord } from "../model";
import { DossierRecordModel } from "../database/DossierRecordModel";

class DossierRepository {
  public add(record: DossierRecord): Observable<DossierRecord> {
    return from(DossierRecordModel.query().insert(record));
  }

  public update(
    recordId: string,
    record: DossierRecord
  ): Observable<DossierRecord> {
    return from(DossierRecordModel.query().patchAndFetchById(recordId, record));
  }

  public findByDSKey(dsKey: string): Observable<DossierRecord[]> {
    return from(
      DossierRecordModel.query().where({
        ds_key: dsKey,
      })
    );
  }

  public all(): Observable<DossierRecord[]> {
    return from(DossierRecordModel.query());
  }

  public findAllByProcedureIn(
    procedureIds: number[]
  ): Observable<DossierRecord[]> {
    return from(
      DossierRecordModel.query().whereIn("procedure_id", procedureIds)
    );
  }

  public findAllByMetadataCreatedAtGTAndProcedureIn(
    createdAt: Date,
    procedureIds: number[]
  ): Observable<DossierRecord[]> {
    return from(
      DossierRecordModel.query()
        .whereIn("procedure_id", procedureIds)
        .andWhere("created_at", ">", createdAt)
    );
  }

  public deleteByDsKey(dsKey: string): Observable<number> {
    return from(
      DossierRecordModel.query()
        .where({
          ds_key: dsKey,
        })
        .delete()
    );
  }
}

export const dossierRepository = new DossierRepository();
