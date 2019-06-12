import { mergeMap, tap } from "rxjs/operators";
import { dossierService, dsProcedureConfigService } from "../collector";
import { demarcheSimplifieeService } from "../demarche-simplifiee";
import { asNumber, logger } from "../util";

export const dossierSynchroService = {
    syncDossier: (procedureId: string, dossierId: string) => {
        return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
            mergeMap((dsDossier) => dsProcedureConfigService.findByProcedureId(asNumber(dsDossier.procedureId, 0)),
                (dsDossier, configs) => ({ ...dsDossier, group: configs[0].group })),
            mergeMap((param) => dossierService.saveOrUpdate(param.group, param.procedureId, param.dossier)),
            tap((dossier) => logger.info(`[SyncService.syncDossier] dossier ${dossier.ds_key} synchronised`))
        );
    }
}