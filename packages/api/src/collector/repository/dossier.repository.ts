import { Observable } from "rxjs";
import { DeletedData } from "../../lib";
import { DossierRecord } from "../model";
import { kintoClientInstance } from "./kinto-client-instance";

class DossierRepository {
  public add(record: DossierRecord): Observable<DossierRecord> {
    return this.collection().add(record);
  }

  public update(
    recordId: string,
    record: DossierRecord
  ): Observable<DossierRecord> {
    return this.collection().update(recordId, record);
  }

  public findByDSKey(dsKey: string): Observable<DossierRecord[]> {
    return this.collection().search(`ds_key="${dsKey}"`);
  }

  public all(): Observable<DossierRecord[]> {
    return this.collection().all();
  }

  public findAllByProcedureIn(
    procedureIds: number[]
  ): Observable<DossierRecord[]> {
    return this.collection().search(`in_metadata.procedure_id=${procedureIds}`);
  }

  public findAllByDsKeyIn(dsKeys: string[]): Observable<DossierRecord[]> {
    return this.collection().search(`in_ds_key=${dsKeys}`);
  }

  public deleteAllByMetadataProcedureId(
    procedureIds: number
  ): Observable<DeletedData[]> {
    return this.collection().delete(`metadata.procedure_id=${procedureIds}`);
  }

  public deleteByDsKey(dsKey: string): Observable<DeletedData[]> {
    return this.collection().delete(`ds_key="${dsKey}"`);
  }

  private collection() {
    return kintoClientInstance.collection<DossierRecord>("dossiers");
  }
}

export const dossierRepository = new DossierRepository();
