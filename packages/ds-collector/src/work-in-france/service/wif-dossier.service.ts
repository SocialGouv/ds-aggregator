import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSDossier } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { WIFRecord } from "../model";
import { wifDossierRepository } from "../repository";

class WIFDossierService {

    public saveOrUpdate(procedureId: string | number, dossier: DSDossier): Observable<WIFRecord<DSDossier>> {
        const wifDossier: WIFRecord<DSDossier> = {
            ds_data: dossier,
            ds_key: `${procedureId}-${dossier.id}`
        }
        return wifDossierRepository.findByDSKey(wifDossier.ds_key).pipe(
            mergeMap((res: Array<WIFRecord<DSDossier>>) => {
                if (res.length === 0) {
                    logger.debug(`[WIFDSDossierService.saveOrUpdate] add dossier for ds_key ${wifDossier.ds_key}`)
                    return wifDossierRepository.add(wifDossier);
                } else {
                    const record: WIFRecord<DSDossier> = res[0];
                    logger.debug(`[WIFDossierService.saveOrUpdate] update dossier for ds_key ${wifDossier.ds_key}`)
                    Object.assign(record, wifDossier);
                    return wifDossierRepository.update(record.id || '', record);
                }
            })
        )
    }

}

export const wifDossierService = new WIFDossierService();
