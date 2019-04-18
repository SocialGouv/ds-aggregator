import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSProcedure } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { WIFRecord } from "../model";
import { wifProcedureRepository } from "../repository/wif.repository";

class WIFProcedureService {

    public saveOrUpdate(procedure: DSProcedure): Observable<WIFRecord<DSProcedure>> {
        const wifProcedure: WIFRecord<DSProcedure> = {
            ds_key: procedure.id,
            ds_data: procedure
        }
        return wifProcedureRepository.findByDSKey(wifProcedure.ds_key).pipe(
            mergeMap((res: WIFRecord<DSProcedure>[]) => {
                if (res.length === 0) {
                    logger.debug(`[WIFProcedureService.saveOrUpdate] no record for ds_key ${wifProcedure.ds_key}`)
                    return wifProcedureRepository.add(wifProcedure);
                } else {
                    const record: WIFRecord<DSProcedure> = res[0];
                    Object.assign(record, wifProcedure);
                    logger.debug(`[WIFProcedureService.saveOrUpdate] record found for ds_key ${wifProcedure.ds_key} id#${record.id}`)
                    return wifProcedureRepository.update(record.id || '', record);
                }
            })
        )
    }

    public all(): Observable<WIFRecord<DSProcedure>[] | null> {
        return wifProcedureRepository.all();
    }
}

export default new WIFProcedureService();
