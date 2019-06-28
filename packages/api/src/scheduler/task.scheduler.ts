import { combineLatest, Observable, of } from "rxjs";
import { concatMap, flatMap, mergeMap } from "rxjs/operators";
import {
  dossierService,
  dsProcedureConfigService,
  ProcedureConfig,
  Task,
  taskService
} from "../collector";
import { configuration } from "../config";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";

export const taskScheduler = {
  start: () => {
    handleScheduler(configuration.schedulerCronTask, "task", () => {
      return combineLatest(
        allTasksToComplete(),
        dsProcedureConfigService.all()
      ).pipe(concatMap(([task, procedures]) => processTask(task, procedures)));
    });
  }
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
      (task: Task) => task
    ),
    mergeMap((task: Task) => taskService.markAsCompleted(task))
  );
}

function allTasksToComplete(): Observable<Task> {
  return taskService.getTasksToComplete().pipe(flatMap((x: Task[]) => x));
}
