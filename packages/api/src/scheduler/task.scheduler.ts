import { combineLatest, Observable, of } from "rxjs";
import { exhaustMap, flatMap, mergeMap, reduce, tap } from "rxjs/operators";
import {
  dossierService,
  dsProcedureConfigService,
  ProcedureConfig,
  Task,
  taskService,
} from "../collector";
import { statisticService } from "../collector/service/statistic.service";
import { configuration } from "../config";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";
import { logger } from "../util";

export const taskScheduler = {
  start: () => {
    handleScheduler(configuration.schedulerCronTask, "task", () => {
      return combineLatest(
        allTasksToComplete(),
        dsProcedureConfigService.all()
      ).pipe(
        mergeMap(
          ([task, procedures]) => processTask(task, procedures),
          undefined,
          10
        ),
        reduce((acc: any[], record: any) => {
          acc.push(record);
          return acc;
        }, []),
        exhaustMap((tasks: any[]) => {
          if (tasks.length > 0) {
            return statisticService.statistic();
          }
          return of();
        })
      );
    });
  },
};

function processTask(taskToTreat: Task, procedures: ProcedureConfig[]) {
  return of(taskToTreat).pipe(
    mergeMap(
      (task: Task) => {
        const procedure =
          procedures.find((p: ProcedureConfig) =>
            p.procedures.includes(task.procedure_id)
          ) || null;
        if (task.action === "add_or_update") {
          return dossierSynchroService.syncDossier(
            task.procedure_id,
            task.dossier_id,
            null,
            procedure
          );
        } else {
          return dossierService.deleteByProcedureIdAndDossierId(
            task.procedure_id,
            task.dossier_id
          );
        }
      },
      (task: Task) => task,
      10
    ),
    mergeMap((task: Task) => taskService.delete(task), 1)
  );
}

function allTasksToComplete(): Observable<Task> {
  return taskService.getTasksToComplete().pipe(
    tap((tasks) => {
      logger.debug(`[task.scheduler] process ${tasks.length} to complete`);
    }),
    flatMap((x: Task[]) => x)
  );
}
