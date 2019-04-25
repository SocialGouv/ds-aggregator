import { interval, Observable, of } from "rxjs";
import { concatMap, flatMap, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { CollectorRecord, collectorService, Task } from "./collector";
import { wifDossierService } from "./collector/service/dossier.service";
import { procedureService } from "./collector/service/procedure.service";
import { demarcheSimplifieeService, DSDossier, DSProcedure } from "./demarche-simplifiee";
import { configuration, logger } from "./util";

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
                logger.info(`[SyncService.startHandleTaskToComplete] task completed: ${next.procedure_id}-${next.dossier_id}`)
                logger.debug(`[SyncService.startHandleTaskToComplete] task completed: `, next)
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
            next: (next: CollectorRecord<DSDossier>) => {
                logger.info(`[SyncService.syncAll] dossier synchronized: ${next.ds_key}`)
                logger.debug(`[SyncService.syncAll] dossier synchronized: `, next)
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


    private updateDossier(procedureId: string, dossierId: string): Observable<CollectorRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
            tap((res) => logger.info(`[SyncService.updateDossier] procedure #${res.procedureId} > dossier ${res.dossier.id} loaded from DS`)),
            mergeMap((res: { dossier: DSDossier, procedureId: string }) => wifDossierService.saveOrUpdate(res.procedureId, res.dossier)
                , (outer, dossier) => ({ dossier, procedureId: outer.procedureId })),
            map((res) => {
                logger.info(`[SyncService.updateDossier] procedure #${res.procedureId} > dossier ${res.dossier.ds_data.id} created / updated into KINTO with id ${res.dossier.id}`);
                return res.dossier;
            })
        );
    }


    private procedureIds(): Observable<string> {
        return of(configuration.dsProcedureIds).pipe(
            flatMap(x => x),
        );
    }

    private updateDossiers(procedureId: string): Observable<CollectorRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSDossiers(procedureId).pipe(
            flatMap(res => {
                logger.info(`[SyncService.updateDossiers] procedure #${res.procedureId} - ${res.dossiers.length} dossiers`);
                return res.dossiers;
            }, (res, dossier) => {
                return { procedureId: res.procedureId, dossier }
            }),
            concatMap((res) => this.updateDossier(res.procedureId, res.dossier.id || ''))
        );
    }

    private updateProcedure(procedureId: string): Observable<CollectorRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
            tap((res) => logger.info(`[SyncService.updateProcedure] procedure #${res.id} - loaded from DS`)),
            mergeMap((res: DSProcedure) => procedureService.saveOrUpdate(res)),
            tap((res: CollectorRecord<DSProcedure>) => logger.info(`[SyncService.updateProcedure] procedure #${res.ds_data.id} - created / updated into KINTO with id ${res.id}`)),
            concatMap((res: CollectorRecord<DSProcedure>) => this.updateDossiers(res.ds_data.id))
        );
    };

}

export const syncService = new SyncService();