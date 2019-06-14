import { mergeMap, tap } from "rxjs/operators";
import {
  DossierRecord,
  dossierService,
  dsProcedureConfigService
} from "../collector";
import { demarcheSimplifieeService, DSDossier } from "../demarche-simplifiee";
import { asNumber, logger } from "../util";

export const dossierSynchroService = {
  syncDossier: (procedureId: string, dossierId: string) => {
    return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
      mergeMap(
        (dsDossier: { dossier: DSDossier; procedureId: string }) =>
          dsProcedureConfigService.findByProcedureId(
            asNumber(dsDossier.procedureId, 0)
          ),
        (dsDossier, configs) => ({ ...dsDossier, group: configs[0].group })
      ),
      mergeMap(
        (param: { dossier: DSDossier; procedureId: string; group: any }) =>
          dossierService.saveOrUpdate(
            param.group,
            param.procedureId,
            param.dossier
          )
      ),
      tap((dossier: DossierRecord) =>
        logger.info(
          `[SyncService.syncDossier] dossier ${dossier.ds_key} synchronised`
        )
      )
    );
  }
};
