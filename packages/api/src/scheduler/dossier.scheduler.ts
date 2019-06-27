import { addDays } from "date-fns";
import { combineLatest, Observable } from "rxjs";
import {
  bufferCount,
  concatMap,
  exhaustMap,
  filter,
  flatMap,
  mergeMap,
  reduce,
  tap
} from "rxjs/operators";
import {
  DossierRecord,
  dsProcedureConfigService,
  ProcedureConfig,
  ProcedureRecord,
  procedureService
} from "../collector";
import { statisticService } from "../collector/service/statistic.service";
import { configuration } from "../config";
import { demarcheSimplifieeService, DSProcedure } from "../demarche-simplifiee";
import { DossierItemInfo, syncService } from "../sync";
import { logger } from "../util";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";

export const dossierScheduler = {
  start: () => {
    handleScheduler(
      configuration.schedulerCronDS,
      "dossier-synchro",
      (start: number) => {
        return combineLatest(
          dsProcedureConfigService.all(),
          allDossierItemInfosToUpdate(start)
        ).pipe(
          mergeMap(
            ([configs, res]) => {
              const procedureConfig = configs.find((c: ProcedureConfig) =>
                c.procedures.includes(res.procedureId)
              );
              return dossierSynchroService.syncDossier(
                res.procedureId,
                res.dossierId,
                res.record || null,
                procedureConfig || null
              );
            },
            undefined,
            2
          ),
          reduce((acc: DossierRecord[], record: DossierRecord) => {
            acc.push(record);
            return acc;
          }, []),
          exhaustMap(() => statisticService.statistic())
        );
      }
    );
  }
};

function syncProcedures(): Observable<ProcedureRecord> {
  return allDemarcheSimlifieeProcedures().pipe(
    concatMap(procedureService.saveOrUpdate)
  );
}

function allDemarcheSimlifieeProcedures(): Observable<DSProcedure> {
  return dsProcedureConfigService.all().pipe(
    flatMap((x: ProcedureConfig[]) => x),
    flatMap((x: ProcedureConfig) => x.procedures),
    concatMap(demarcheSimplifieeService.getDSProcedure),
    tap((res: DSProcedure) =>
      logger.info(
        `[SyncService.allDemarcheSimlifieeProcedures] procedure#${res.id} - ${res.total_dossier} dossiers`
      )
    )
  );
}

function allDemarcheSimplifieeDossierItems(): Observable<DossierItemInfo> {
  return syncProcedures().pipe(
    concatMap((record: ProcedureRecord) =>
      syncService.allDossierItemInfos(record)
    )
  );
}

function allDossierItemInfosToUpdate(
  start: number
): Observable<DossierItemInfo> {
  return allDemarcheSimplifieeDossierItems().pipe(
    filter((item: DossierItemInfo) => {
      // optimisation to eliminate most of dossiers
      const startLess2Days = addDays(new Date(start), -2).getTime();
      return item.updatedDate > startLess2Days;
    }),
    bufferCount(100),
    concatMap((res: DossierItemInfo[]) =>
      syncService.associateDossierRecord(res)
    ),
    flatMap((res: DossierItemInfo[]) => res),
    filter((res: DossierItemInfo) => {
      // filter to keep only dossier to update
      if (!res.record) {
        return true;
      }
      const recordUpdateAt = res.record.metadata.updated_at;
      if (!recordUpdateAt) {
        return true;
      }
      return res.updatedDate > recordUpdateAt;
    }),
    tap((res: DossierItemInfo) =>
      logger.info(
        `[SyncService.allDossierItemInfos] dossier ${res.procedureId}-${res.dossierId} will be synchronised`
      )
    )
  );
}
