import { combineLatest, of } from "rxjs";
import { map, mergeMap, tap } from "rxjs/operators";
import {
  DossierRecord,
  dossierService,
  dsProcedureConfigService,
  ProcedureConfig
} from "../collector";
import { demarcheSimplifieeService } from "../demarche-simplifiee";
import { asNumber, logger } from "../util";

export const dossierSynchroService = {
  syncDossier: (
    procedureId: string,
    dossierId: string,
    procedureConfig?: ProcedureConfig
  ) => {
    return combineLatest(
      getProcedureConfig(procedureId, procedureConfig),
      of(procedureId),
      demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
    ).pipe(
      mergeMap(([config, procId, dossier]) =>
        dossierService.saveOrUpdate(config.group, procId, dossier)
      ),
      tap((dossier: DossierRecord) =>
        logger.info(
          `[SyncService.syncDossier] dossier ${dossier.ds_key} synchronised`
        )
      )
    );
  }
};

function getProcedureConfig(
  procedureId: string,
  procedureConfig?: ProcedureConfig
) {
  return procedureConfig
    ? of(procedureConfig)
    : dsProcedureConfigService
        .findByProcedureId(asNumber(procedureId, 0))
        .pipe(map((res: ProcedureConfig[]) => res[0]));
}
