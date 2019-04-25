import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSProcedure } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { CollectorRecord } from "../model";
import { procedureRepository } from "../repository";

class ProcedureService {

    public saveOrUpdate(procedure: DSProcedure): Observable<CollectorRecord<DSProcedure>> {
        const wifProcedure: CollectorRecord<DSProcedure> = {
            ds_data: procedure,
            ds_key: procedure.id
        }
        return procedureRepository.findByDSKey(wifProcedure.ds_key).pipe(
            mergeMap((res: Array<CollectorRecord<DSProcedure>>) => {
                if (res.length === 0) {
                    logger.debug(`[WIFProcedureService.saveOrUpdate] no record for ds_key ${wifProcedure.ds_key}`)
                    return procedureRepository.add(wifProcedure);
                } else {
                    const record: CollectorRecord<DSProcedure> = res[0];
                    Object.assign(record, wifProcedure);
                    logger.debug(`[WIFProcedureService.saveOrUpdate] record found for ds_key ${wifProcedure.ds_key} id#${record.id}`)
                    return procedureRepository.update(record.id || '', record);
                }
            })
        )
    }

    public all(): Observable<Array<CollectorRecord<DSProcedure>> | null> {
        return procedureRepository.all();
    }
}

export const procedureService = new ProcedureService();
