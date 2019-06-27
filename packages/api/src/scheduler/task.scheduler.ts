import { Observable, of } from "rxjs";
import { concatMap, flatMap, mergeMap } from "rxjs/operators";
import { DossierRecord, dossierService, Task, taskService } from "../collector";
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

function syncDossierAndCompleteTask(taskToTreat: Task) {
  return of(taskToTreat).pipe(
    mergeMap(
      (task: Task) =>
        dossierService.findByDsKey(`${task.procedure_id}-${task.dossier_id}`),
      (task: Task, record: DossierRecord | null) => ({ task, record })
    ),
    mergeMap(
      (input: { task: Task; record: DossierRecord | null }) =>
        dossierSynchroService.syncDossier(
          input.task.procedure_id,
          input.task.dossier_id,
          input.record,
          null
        ),
      (input, record) => ({ task: input.task, record })
    ),
    mergeMap((res: { task: Task; record: DossierRecord }) =>
      taskService.markAsCompleted(res.task)
    )
  );
}

function allTasksToComplete(): Observable<Task> {
  return taskService.getTasksToComplete().pipe(flatMap((x: Task[]) => x));
}
