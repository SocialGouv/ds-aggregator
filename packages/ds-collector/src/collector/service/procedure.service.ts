import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSProcedure } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { ProcedureRecord, Record } from "../model";
import { procedureRepository } from "../repository";

class ProcedureService {

    public saveOrUpdate(procedure: DSProcedure): Observable<ProcedureRecord> {
        if (!procedure.id) {
            throw new Error('[ProcedureService.saveOrUpdate] Procedure id should not be null.');
        }
        const wifProcedure: Record<DSProcedure> = {
            ds_data: procedure,
            ds_key: procedure.id
        }
        return procedureRepository.findByDSKey(wifProcedure.ds_key).pipe(
            mergeMap((res: Array<Record<DSProcedure>>) => {
                if (res.length === 0) {
                    logger.debug(`[ProcedureService.saveOrUpdate] no record for ds_key ${wifProcedure.ds_key}`)
                    return procedureRepository.add(wifProcedure);
                } else {
                    const record: Record<DSProcedure> = res[0];
                    Object.assign(record, wifProcedure);
                    logger.debug(`[ProcedureService.saveOrUpdate] record found for ds_key ${wifProcedure.ds_key} id#${record.id}`)
                    return procedureRepository.update(record.id || '', record);
                }
            })
        )
    }

    public all(): Observable<ProcedureRecord[]> {
        return procedureRepository.all();
    }
}

export const procedureService = new ProcedureService();
