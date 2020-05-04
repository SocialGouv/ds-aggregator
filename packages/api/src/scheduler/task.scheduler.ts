import { combineLatest, Observable, of, EMPTY } from "rxjs";
import {
  exhaustMap,
  flatMap,
  mergeMap,
  reduce,
  catchError,
  tap
} from "rxjs/operators";
import {
  dossierService,
  dsProcedureConfigService,
  ProcedureConfig,
  statisticService,
  Task,
  taskService
} from "../collector";
import { configuration } from "../config";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";
import { logger } from "../util";

export const taskScheduler = {
  start: () => {
    handleScheduler(
      configuration.schedulerCronTask,
      "task",
      taskSchedulerProcess
    );
  }
};

export const taskSchedulerProcess = () => {
  return combineLatest(
    allTasksToComplete(),
    dsProcedureConfigService.all()
  ).pipe(
    mergeMap(([task, procedures]) => processTask(task, procedures), 1),
    reduce((acc: Task[], record: Task) => {
      acc.push(record);
      return acc;
    }, []),
    exhaustMap((tasks: Task[]) => {
      if (tasks.length > 0) {
        return statisticService.statistic();
      }
      return of();
    })
  );
};

function processTask(taskToTreat: Task, procedures: ProcedureConfig[]) {
  return of(taskToTreat).pipe(
    mergeMap(
      (task: Task) => {
        const procedure = procedures.find((p: ProcedureConfig) =>
          p.procedures.includes(task.procedure_id)
        );
        if (task.action === "add_or_update") {
          return dossierSynchroService.syncDossier(
            task.procedure_id,
            task.dossier_id,
            undefined,
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
      1
    ),
    mergeMap(
      (task: Task) =>
        taskService.markAsCompleted(task).pipe(
          catchError(err => {
            logger.error(
              `[task.scheduler] cannot update as completed task ${task.id}`,
              err
            );
            return EMPTY;
          })
        ),
      1
    )
  );
}

function allTasksToComplete(): Observable<Task> {
  return taskService.getTasksToComplete().pipe(
    tap(tasks => {
      logger.debug(`[task.scheduler] process ${tasks.length} to complete`);
    }),
    flatMap((x: Task[]) => x)
  );
}
