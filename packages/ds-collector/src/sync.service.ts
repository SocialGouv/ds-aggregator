import { interval, Observable, of } from "rxjs";
import { concatMap, flatMap, mergeMap, switchMap, tap } from "rxjs/operators";
import { collectorService, Task } from "./collector";
import { demarcheSimplifieeService, DSDossier, DSDossierItem, DSProcedure } from "./demarche-simplifiee";
import { configuration, logger } from "./util";
import { wifDossierService, wifProcedureService, WIFRecord } from "./work-in-france";


class SyncService {

    public startHandleTaskToComplete(periodInMilliSecond: number) {
        logger.info(`[TASK] periodInMilliSecond: ${periodInMilliSecond}`)
        interval(periodInMilliSecond).pipe(
            tap((val) => logger.info(`[SyncService.startHandleTaskToComplete] ${val}`)),
            switchMap(() => syncService.handleTasksToComplete())
        ).subscribe({
            complete: () => {
                logger.info(`[SyncService.startHandleTaskToComplete] tasks with success`)
            },
            error: (error: any) => {
                logger.error(`[SyncService.startHandleTaskToComplete] error: `, error)
            },
            next: (next: Task) => {
                logger.info(`[SyncService.startHandleTaskToComplete] task completed: `, next)
            }
        })
    }

    public syncAll() {
        return this.procedureIds().pipe(
            tap((procedureId) => logger.info(`[SyncService.syncAll] start procedure #${procedureId}]`)),
            concatMap((procedureId) => this.updateProcedure(procedureId))
        ).subscribe({
            complete: () => {
                logger.info(`[SyncService.syncAll] success`)
            },
            error: (error: any) => {
                logger.error(`[SyncService.syncAll] error: `, error)
            },
            next: (next: WIFRecord<DSDossier>) => {
                logger.info(`[SyncService.syncAll] dossier synchronized: `, next)
            }
        })
    }

    private handleTasksToComplete(): Observable<Task> {
        return collectorService.getTasksToComplete().pipe(
            flatMap(x => x),
            concatMap((task) => this.updateDossier(task.procedure_id, task.dossier_id), (task, dossier) => ({ task, dossier })),
            switchMap(({ task }) => collectorService.markAsCompleted(task))
        );
    }

    private updateDossier(procedureId: string, dossierId: string): Observable<WIFRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
            tap((res: DSDossier) => logger.info(`[SyncService.updateDossier] procedure #${procedureId} > dossier ${res.id} loaded from DS`)),
            mergeMap((res: DSDossier) => wifDossierService.saveOrUpdate(procedureId, res)),
            tap((res: WIFRecord<DSDossier>) => logger.info(`[SyncService.updateDossier] procedure #${procedureId} > dossier ${res.ds_data.id} created / updated into KINTO with id ${res.id}`))
        );
    }

    private procedureIds(): Observable<string> {
        return of(configuration.dsProcedureIds).pipe(
            flatMap(x => x),
        );
    }

    private updateDossiers(procedureId: string): Observable<WIFRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSDossiers(procedureId).pipe(
            tap((res: DSDossierItem[]) => logger.info(`[SyncService.updateDossiers] procedure #${procedureId} - ${res.length} dossiers`)),
            flatMap(x => x),
            concatMap((res: DSDossierItem) => this.updateDossier(procedureId, res.id || ''))
        );
    }

    private updateProcedure(procedureId: string): Observable<WIFRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
            tap(() => logger.info(`[SyncService.updateProcedure] procedure #${procedureId} - loaded from DS`)),
            mergeMap((res: DSProcedure) => wifProcedureService.saveOrUpdate(res)),
            tap((res: WIFRecord<DSProcedure>) => logger.info(`[SyncService.updateProcedure] procedure #${procedureId} - created / updated into KINTO with id ${res.id}`)),
            concatMap((res: WIFRecord<DSProcedure>) => this.updateDossiers(res.ds_data.id))
        );
    };

}

export const syncService = new SyncService();