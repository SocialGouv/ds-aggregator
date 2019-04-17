import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSProcedure } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { wifProcedureRepository } from "../api/wif.api";
import { WIFRecord } from "../model";

class WIFProcedureService {

    constructor() {

    }

    public saveOrCreate(procedure: DSProcedure): Observable<WIFRecord<DSProcedure> | null> {
        const wifProcedure: WIFRecord<DSProcedure> = {
            ds_key: procedure.id,
            ds_data: procedure
        }
        return wifProcedureRepository.findByDSKey(wifProcedure).pipe(
            mergeMap((res) => {
                
                if (res === null) {
                    // add record
                    logger.info(`[WIFProcedureService.saveOrCreate] no record for ds_key ${wifProcedure.ds_key}`)
                    return wifProcedureRepository.add(wifProcedure);
                } else {
                    // update record
                    logger.info(`[WIFProcedureService.saveOrCreate] record found for ds_key ${wifProcedure.ds_key}`)
                    Object.assign(res, wifProcedure);
                    logger.info(`[WIFProcedureService.saveOrCreate] updating record ${JSON.stringify(res.id, undefined, 2)}`)
                    
                    return wifProcedureRepository.update(res);
                }
            })
        )
    }

    public all() : Observable<WIFRecord<DSProcedure>[] | null> {
        return wifProcedureRepository.all();
    }
}

export default new WIFProcedureService();