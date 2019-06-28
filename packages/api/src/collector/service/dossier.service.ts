import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { DSDossier } from "../../demarche-simplifiee";
import { DeletedData } from "../../lib";
import { asTimestamp } from "../../util/converter";
import { DossierRecord } from "../model";
import { dossierRepository } from "../repository";

class DossierService {
  public all(): Observable<DossierRecord[]> {
    return dossierRepository.all();
  }

  public allByDsKeyIn(dsKeys: string[]): Observable<DossierRecord[]> {
    return dossierRepository.findAllByDsKeyIn(dsKeys);
  }

  public findByDsKey(dsKey: string): Observable<DossierRecord | null> {
    return dossierRepository.findByDSKey(dsKey).pipe(
      map((dossiers: DossierRecord[]) => {
        if (dossiers.length === 0) {
          return null;
        } else {
          return dossiers[0];
        }
      })
    );
  }

  public allByMetadataProcedureId(
    procedureId: number
  ): Observable<DossierRecord[]> {
    return dossierRepository.findAllByProcedureIn([procedureId]);
  }
  public deleteByProcedureId(procedureId: number): Observable<DeletedData[]> {
    return dossierRepository.deleteAllByMetadataProcedureId(procedureId);
  }

  public deleteByProcedureIdAndDossierId(
    procedureId: number,
    dossierId: number
  ): Observable<DeletedData[]> {
    return dossierRepository.deleteByDsKey(`${procedureId}-${dossierId}`);
  }

  public update(
    record: DossierRecord,
    dossier: DSDossier
  ): Observable<DossierRecord> {
    if (!record.id) {
      throw new Error("Trying to update reord without id!!");
    }

    const instructorsHistory = buildInstructorsHistory(
      record.metadata.instructors_history,
      dossier.instructeurs
    );
    record.ds_data = dossier;
    record.metadata = {
      ...record.metadata,
      created_at: asTimestamp(dossier.created_at) || 0,
      initiated_at: asTimestamp(dossier.initiated_at),
      instructors_history: dossier.instructeurs ? dossier.instructeurs : [],
      processed_at: asTimestamp(dossier.processed_at),
      received_at: asTimestamp(dossier.received_at),
      state: dossier.state,
      updated_at: asTimestamp(dossier.updated_at)
    };
    record.metadata.instructors_history = instructorsHistory;

    return dossierRepository.update(record.id, record);
  }

  public save(
    group: { id: string; label: string },
    procedureId: number,
    dossier: DSDossier
  ): Observable<DossierRecord> {
    const wifDossier: DossierRecord = {
      ds_data: dossier,
      ds_key: `${procedureId}-${dossier.id}`,
      metadata: {
        group,
        procedure_id: procedureId as number,
        state: dossier.state,
        // tslint:disable-next-line: object-literal-sort-keys
        created_at: asTimestamp(dossier.created_at) || 0,
        updated_at: asTimestamp(dossier.updated_at),
        initiated_at: asTimestamp(dossier.initiated_at),
        received_at: asTimestamp(dossier.received_at),
        processed_at: asTimestamp(dossier.processed_at),
        instructors_history: dossier.instructeurs ? dossier.instructeurs : []
      }
    };
    return dossierRepository.findByDSKey(wifDossier.ds_key).pipe(
      mergeMap((dossiers: DossierRecord[]) => {
        if (dossiers.length === 0) {
          return dossierRepository.add(wifDossier);
        } else {
          const loadedRecord = dossiers[0];
          loadedRecord.ds_data = wifDossier.ds_data;
          loadedRecord.metadata = wifDossier.metadata;
          loadedRecord.metadata.instructors_history = buildInstructorsHistory(
            loadedRecord.metadata.instructors_history,
            wifDossier.metadata.instructors_history
          );
          return dossierRepository.update(loadedRecord.id || "0", loadedRecord);
        }
      })
    );
  }
}

export const dossierService = new DossierService();

const buildInstructorsHistory = (
  instructeurs: string[],
  newinstructeurs: string[]
) => {
  const instructeursHistory: string[] = [];
  instructeurs.forEach((i: string) => instructeursHistory.push(i));
  newinstructeurs.forEach((i: string) => {
    if (!instructeursHistory.includes(i)) {
      instructeursHistory.push(i);
    }
  });
  return instructeursHistory;
};
