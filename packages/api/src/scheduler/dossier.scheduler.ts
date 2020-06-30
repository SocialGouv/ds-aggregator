import { combineLatest, Observable, forkJoin } from "rxjs";
import { concatMap, flatMap, map, mergeMap, tap, share } from "rxjs/operators";
import {
  apiResultService,
  dsProcedureConfigService,
  ProcedureConfig,
  ProcedureRecord,
  procedureService,
  taskService
} from "../collector";
import { APIResult, SynchroAction } from "../collector/model/api-result.model";
import { configuration } from "../config";
import {
  demarcheSimplifieeService,
  DSDossierItem,
  DSProcedure
} from "../demarche-simplifiee";
import { syncService } from "../sync";
import { logger } from "../util";
import { handleScheduler } from "./scheduler.service";

interface SyncContext {
  items: DSDossierItem[];
  apiResult: APIResult;
}

export const dossierScheduler = {
  start: () => {
    handleScheduler(configuration.schedulerCronDS, "dossier-synchro", () => {
      const apiResult$ = syncProcedures().pipe(
        mergeMap((x: ProcedureRecord) => buildSyncContext(x)),
        map((x: SyncContext) => {
          const actions = getSynchroActions(x.items, x.apiResult);
          x.apiResult.items = x.items;
          x.apiResult.actions = actions;
          return x.apiResult;
        }),
        share()
      );

      const addAllTasks$ = apiResult$.pipe(
        tap(apiResult =>
          logger.info(
            `[dossier.scheduler] procedure#${apiResult.procedure} - add ${apiResult.actions.length} actions`
          )
        ),
        flatMap((x: APIResult) =>
          x.actions.map((a: SynchroAction) => ({ action: a, apiResult: x }))
        ),
        mergeMap(({ action }) => {
          return taskService.addTask(
            action.action,
            action.procedure,
            action.item.id,
            action.item.state,
            action.item.updated_at
          );
        }, 10)
      );

      const updateApiResult$ = apiResult$.pipe(
        mergeMap((apiResult: APIResult) => {
          return apiResultService.update(apiResult);
        }, 1)
      );

      return forkJoin(addAllTasks$, updateApiResult$);
    });
  }
};

function getSynchroActions(items: DSDossierItem[], apiResult: APIResult) {
  const actions: SynchroAction[] = [];
  items.forEach((fetchedItem: DSDossierItem) => {
    const loadedItem = apiResult.items.find(
      (i: DSDossierItem) => i.id === fetchedItem.id
    );
    if (!loadedItem) {
      actions.push({
        action: "add_or_update",
        item: fetchedItem,
        procedure: apiResult.procedure
      });
    } else if (loadedItem.updated_at !== fetchedItem.updated_at) {
      actions.push({
        action: "add_or_update",
        item: loadedItem,
        procedure: apiResult.procedure
      });
    }
  });

  apiResult.items.forEach((loadedItem: DSDossierItem) => {
    const fetchedItem = items.find(
      (i: DSDossierItem) => i.id === loadedItem.id
    );
    if (!fetchedItem) {
      actions.push({
        action: "delete",
        item: loadedItem,
        procedure: apiResult.procedure
      });
    }
  });
  return actions;
}

function buildSyncContext(x: ProcedureRecord): Observable<SyncContext> {
  return combineLatest(
    syncService.allDossierItems(x),
    apiResultService.findByProcedureId(x.ds_key)
  ).pipe(map(([items, apiResult]) => ({ items, apiResult })));
}

function syncProcedures(): Observable<ProcedureRecord> {
  return allDemarcheSimlifieeProcedures().pipe(
    concatMap(procedureService.saveOrUpdate)
  );
}

function allDemarcheSimlifieeProcedures(): Observable<DSProcedure> {
  return dsProcedureConfigService.all().pipe(
    tap(procedureConfigs =>
      logger.info(
        `[SyncService.allDemarcheSimlifieeProcedures] process ${procedureConfigs.length} procedures`
      )
    ),
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
