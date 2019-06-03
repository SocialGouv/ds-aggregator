import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { DSDossier } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { asTimestamp } from "../../util/converter";
import { DossierRecord } from "../model";
import { dossierRepository } from "../repository";

class DossierService {

    public all(): Observable<DossierRecord[]> {
        return dossierRepository.all();
    }

    public allByMetadataProcedureId(procedureId: string): Observable<DossierRecord[]> {
        return dossierRepository.findAllByProcedureIn([procedureId]);
    }

    public findOne(procedureId: string, dossierId: string): Observable<DossierRecord | null> {
        return dossierRepository.findByDSKey(this.getDSKey(procedureId, dossierId)).pipe(
            map((res) => {
                if (res.length === 0) {
                    return null;
                }
                return res[0];
            })
        );
    }

    public saveOrUpdate(group: { id: string, label: string }, procedureId: string, dossier: DSDossier): Observable<DossierRecord> {
        const wifDossier: DossierRecord = {
            ds_data: dossier,
            ds_key: `${procedureId}-${dossier.id}`,
            metadata: {
                group,
                procedure_id: procedureId,
                state: dossier.state,
                // tslint:disable-next-line: object-literal-sort-keys
                created_at: asTimestamp(dossier.created_at) || 0,
                updated_at: asTimestamp(dossier.updated_at),
                initiated_at: asTimestamp(dossier.initiated_at),
                received_at: asTimestamp(dossier.received_at),
                processed_at: asTimestamp(dossier.processed_at),
                instructors_history: dossier.instructeurs ? dossier.instructeurs : []
            }
        }
        return dossierRepository.findByDSKey(wifDossier.ds_key).pipe(
            mergeMap((res: DossierRecord[]) => {
                if (res.length === 0) {
                    logger.debug(`[DossierService.saveOrUpdate] add dossier for ds_key ${wifDossier.ds_key}`)
                    return dossierRepository.add(wifDossier);
                } else {
                    const record: DossierRecord = res[0];
                    logger.debug(`[DossierService.saveOrUpdate] update dossier for ds_key ${wifDossier.ds_key}`);
                    const instructorsHistory = buildInstructorsHistory(record, wifDossier);
                    Object.assign(record, wifDossier);
                    record.metadata.instructors_history = instructorsHistory;

                    return dossierRepository.update(record.id || '', record);
                }
            })
        )
    }

    private getDSKey(procedureId: string, dossierId: string) {
        return `${procedureId}-${dossierId}`;
    }
}

export const dossierService = new DossierService();

const buildInstructorsHistory = (record: DossierRecord, newRecord: DossierRecord) => {
    const instructeursHistory: string[] = [];
    record.metadata.instructors_history.forEach(i => instructeursHistory.push(i));
    newRecord.metadata.instructors_history.forEach((i) => {
        if (!instructeursHistory.includes(i)) {
            instructeursHistory.push(i);
        }
    });
    return instructeursHistory;
}
