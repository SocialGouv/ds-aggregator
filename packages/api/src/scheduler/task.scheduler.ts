import { Observable, of } from "rxjs";
import {
  exhaustMap,
  flatMap,
  mergeMap,
  tap,
  reduce,
  map,
} from "rxjs/operators";
import {
  dossierService,
  dsProcedureConfigService,
  ProcedureConfig,
  Task,
  taskService,
} from "../collector";
import { configuration } from "../config";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";
import { logger } from "../util";
import { statisticService } from "../collector/service/statistic.service";

export const taskScheduler = {
  start: () => {
    handleScheduler(configuration.schedulerCronTask, "task", () => {
      return allTasksToComplete().pipe(
        mergeMap((task) => processTask(task), 2),
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

function processTask(taskToTreat: Task) {
  return of(taskToTreat).pipe(
    mergeMap(
      (task: Task) => {
        if (task.action === "add_or_update") {
          return dsProcedureConfigService
            .findByProcedureId(task.procedure_id)
            .pipe(
              map((res: ProcedureConfig[]) => res[0]),
              mergeMap((procedure) =>
                dossierSynchroService.syncDossier(
                  task.procedure_id,
                  task.dossier_id,
                  procedure
                )
              )
            );
        } else {
          return dossierService.deleteByProcedureIdAndDossierId(
            task.procedure_id,
            task.dossier_id
          );
        }
      },
      (task: Task) => task
    ),
    mergeMap((task: Task) => taskService.delete(task))
  );
}

function allTasksToComplete(): Observable<Task> {
  return taskService.getTasksToComplete().pipe(
    tap((tasks) => {
      logger.info(`[task.scheduler] process ${tasks.length} to complete`);
    }),
    flatMap((x: Task[]) => x)
  );
}
