import { combineLatest, of } from "rxjs";
import { map, mergeMap, tap } from "rxjs/operators";
import {
  DossierRecord,
  dossierService,
  dsProcedureConfigService,
  ProcedureConfig,
} from "../collector";
import { demarcheSimplifieeService } from "../demarche-simplifiee";
import { logger } from "../util";

export const dossierSynchroService = {
  syncDossier: (
    procedureId: number,
    dossierId: number,
    procedureConfig: ProcedureConfig | null
  ) => {
    return combineLatest(
      getProcedureConfig(procedureId, procedureConfig),
      of(procedureId),
      demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
    ).pipe(
      mergeMap(([config, procId, dossier]) => {
        if (dossier == null) {
          logger.info(
            `[SyncService.syncDossier] dossier ${procId}-${dossierId} not found`
          );
          return of(null);
        }
        return dossierService.saveOrUpdate(config.group, procId, dossier);
      }),
      tap((dossier: DossierRecord | null) => {
        if (dossier) {
          logger.info(
            `[SyncService.syncDossier] dossier ${dossier.ds_key} synchronised`
          );
        }
      })
    );
  },
};

function getProcedureConfig(
  procedureId: number,
  procedureConfig: ProcedureConfig | null
) {
  return procedureConfig
    ? of(procedureConfig)
    : dsProcedureConfigService
        .findByProcedureId(procedureId)
        .pipe(map((res: ProcedureConfig[]) => res[0]));
}
