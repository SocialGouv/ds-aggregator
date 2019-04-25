import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSDossier } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { DSRecord } from "../model";
import { dossierRepository } from "../repository";

class DossierService {

    public saveOrUpdate(procedureId: string | number, dossier: DSDossier): Observable<DSRecord<DSDossier>> {
        const wifDossier: DSRecord<DSDossier> = {
            ds_data: dossier,
            ds_key: `${procedureId}-${dossier.id}`
        }
        return dossierRepository.findByDSKey(wifDossier.ds_key).pipe(
            mergeMap((res: Array<DSRecord<DSDossier>>) => {
                if (res.length === 0) {
                    logger.debug(`[WIFDSDossierService.saveOrUpdate] add dossier for ds_key ${wifDossier.ds_key}`)
                    return dossierRepository.add(wifDossier);
                } else {
                    const record: DSRecord<DSDossier> = res[0];
                    logger.debug(`[WIFDossierService.saveOrUpdate] update dossier for ds_key ${wifDossier.ds_key}`)
                    Object.assign(record, wifDossier);
                    return dossierRepository.update(record.id || '', record);
                }
            })
        )
    }

}

export const wifDossierService = new DossierService();
