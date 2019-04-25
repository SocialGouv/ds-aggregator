import { interval, Observable, of } from "rxjs";
import { concatMap, flatMap, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { DSRecord, Task, taskService } from "./collector";
import { wifDossierService } from "./collector/service/dossier.service";
import { procedureService } from "./collector/service/procedure.service";
import { demarcheSimplifieeService, DSDossier, DSProcedure } from "./demarche-simplifiee";
import { configuration, logger } from "./util";

class SyncService {

    public startHandleTaskToComplete(periodInMilliSecond: number) {
        logger.info(`[SyncService.startHandleTaskToComplete] periodInMilliSecond: ${periodInMilliSecond}`)
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
            next: (next: DSRecord<DSDossier>) => {
                logger.info(`[SyncService.syncAll] dossier synchronized: ${next.ds_key}`)
                logger.debug(`[SyncService.syncAll] dossier synchronized: `, next)
            }
        })
    }

    private handleTasksToComplete(): Observable<Task> {
        return taskService.getTasksToComplete().pipe(
            flatMap(x => x),
            concatMap((task) => this.updateDossier(task.procedure_id, task.dossier_id), (task, dossier) => ({ task, dossier })),
            switchMap(({ task }) => taskService.markAsCompleted(task))
        );
    }


    private updateDossier(procedureId: string, dossierId: string): Observable<DSRecord<DSDossier>> {
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

    private updateDossiers(procedureId: string, page: number, resultPerPage: number): Observable<DSRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSDossiers(procedureId, page, resultPerPage).pipe(
            flatMap(res => {
                logger.info(`[SyncService.updateDossiers] procedure #${res.procedureId} - page ${page} / resultPerPage ${resultPerPage}: ${res.dossiers.length} dossiers`);
                return res.dossiers;
            }, (res, dossier) => {
                return { procedureId: res.procedureId, dossier }
            }),
            concatMap((res) => this.updateDossier(res.procedureId, res.dossier.id || ''))
        );
    }

    private updateProcedure(procedureId: string): Observable<DSRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
            tap((res) => logger.info(`[SyncService.updateProcedure] procedure #${res.id} - loaded from DS`)),
            mergeMap((res: DSProcedure) => procedureService.saveOrUpdate(res)),
            tap((res: DSRecord<DSProcedure>) => logger.info(`[SyncService.updateProcedure] procedure #${res.ds_data.id} - created / updated into KINTO with id ${res.id}`)),
            flatMap((res: DSRecord<DSProcedure>) => {
                const resultPerPage = 10;
                const maxPageNumber = Math.ceil(res.ds_data.total_dossier / resultPerPage);
                const result = [];

                for (let page = 1; page <= maxPageNumber; page++) {
                    logger.info(`[SyncService.updateProcedure] procedure #${res.ds_data.id} - add params: page ${page} / ${maxPageNumber}, resultPerPage ${resultPerPage}` )
                    result.push({ procedureId: res.ds_data.id, resultPerPage, page });
                }
                return result;
            }),
            concatMap((res) => this.updateDossiers(res.procedureId, res.page, res.resultPerPage))
        );
    };

}

export const syncService = new SyncService();