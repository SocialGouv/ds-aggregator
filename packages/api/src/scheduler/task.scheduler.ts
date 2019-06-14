import { Observable, of } from "rxjs";
import { concatMap, flatMap, mergeMap } from "rxjs/operators";
import { DossierRecord, Task, taskService } from "../collector";
import { configuration } from "../config";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";

export const taskScheduler = {
  start: () => {
    handleScheduler(configuration.schedulerCronTask, "task", () => {
      return allTasksToComplete().pipe(concatMap(syncDossierAndCompleteTask));
    });
  }
};

function syncDossierAndCompleteTask(task: Task) {
  return of(task).pipe(
    mergeMap(
      (t: Task) =>
        dossierSynchroService.syncDossier(t.procedure_id, t.dossier_id),
      (outer, inner) => ({ task: outer, dossier: inner })
    ),
    mergeMap((res: { task: Task; dossier: DossierRecord }) =>
      taskService.markAsCompleted(res.task)
    )
  );
}

function allTasksToComplete(): Observable<Task> {
  return taskService.getTasksToComplete().pipe(flatMap((x: Task[]) => x));
}
