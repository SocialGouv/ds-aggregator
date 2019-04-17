import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DSDossier } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { WIFRecord } from "../model";
import { wifDossierRepository } from "../repository";

class WIFDossierService {

    public saveOrCreate(procedureId: string | number, dossier: DSDossier): Observable<WIFRecord<DSDossier>> {
        const wifDossier: WIFRecord<DSDossier> = {
            ds_key: `${procedureId}-${dossier.id}`,
            ds_data: dossier
        }
        return wifDossierRepository.findByDSKey(wifDossier.ds_key).pipe(
            mergeMap((res: WIFRecord<DSDossier>[]) => {
                if (res.length === 0) {
                    logger.info(`[WIFDSDossierService.saveOrCreate] add dossier for ds_key ${wifDossier.ds_key}`)
                    return wifDossierRepository.add(wifDossier);
                } else {
                    const record: WIFRecord<DSDossier> = res[0];
                    logger.info(`[WIFDossierService.saveOrCreate] update dossier for ds_key ${wifDossier.ds_key}`)
                    Object.assign(record, wifDossier);
                    return wifDossierRepository.update(record.id || '', record);
                }
            })
        )
    }

}

export default new WIFDossierService();
