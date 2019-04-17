import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSProcedure } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { WIFRecord } from "../model";
import { wifProcedureRepository } from "../repository/wif.repository";

class WIFProcedureService {

    constructor() {

    }

    public saveOrCreate(procedure: DSProcedure): Observable<WIFRecord<DSProcedure>> {
        const wifProcedure: WIFRecord<DSProcedure> = {
            ds_key: procedure.id,
            ds_data: procedure
        }
        return wifProcedureRepository.findByDSKey(wifProcedure.ds_key).pipe(
            mergeMap((res: WIFRecord<DSProcedure>[]) => {
                if (res.length === 0) {
                    logger.info(`[WIFProcedureService.saveOrCreate] no record for ds_key ${wifProcedure.ds_key}`)
                    return wifProcedureRepository.add(wifProcedure);
                } else {
                    const record: WIFRecord<DSProcedure> = res[0];
                    logger.info(`[WIFProcedureService.saveOrCreate] record found for ds_key ${wifProcedure.ds_key}`)
                    Object.assign(record, wifProcedure);
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
