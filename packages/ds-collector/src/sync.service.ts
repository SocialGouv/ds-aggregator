import { interval, Observable } from "rxjs";
import { concatMap, filter, flatMap, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { DossierRecord, dossierService, dsProcedureConfigService, procedureService, Record, Task, taskService } from "./collector";
import { demarcheSimplifieeService, DSDossier, DSDossierItem, DSProcedure } from "./demarche-simplifiee";
import { DossierListResult } from "./demarche-simplifiee/service/ds.service";
import { logger } from "./util";
import { asTimestamp } from "./util/converter";

class SyncService {

    public startHandleTaskToComplete(periodInMilliSecond: number) {
        logger.info(`[SyncService.startHandleTaskToComplete] periodInMilliSecond: ${periodInMilliSecond}`)
        interval(periodInMilliSecond).pipe(
            tap(() => logger.info(`[SyncService.startHandleTaskToComplete] check if tasks must be processed`)),
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
        dsProcedureConfigService.all().pipe(
            flatMap(x => x),
            flatMap(x => x.procedures),
            concatMap((res) => {
                logger.info(`[SyncService.syncAll] start procedure #${res}]`);
                return this.updateProcedure(res);
            }), 
        ).subscribe({
            complete: () => {
                logger.info(`[SyncService.syncAll] success`)
            },
            error: (error: any) => {
                logger.error(`[SyncService.syncAll] error: `, error)
            },
            next: (next: Record<DSDossier>) => {
                logger.info(`[SyncService.syncAll] dossier ${next.ds_key} synchronized`)
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


    private updateDossier(procedureId: string, dossierId: string): Observable<Record<DSDossier>> {
        return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
            switchMap((res: { dossier: DSDossier, procedureId: string }) => dossierService.saveOrUpdate(res.procedureId, res.dossier)
                , (outer, dossier) => ({ dossier, procedureId: outer.procedureId })),
            map((res) => res.dossier)
        );
    }


    private updateDossiers(procedureId: string, page: number, resultPerPage: number): Observable<Record<DSDossier>> {
        return demarcheSimplifieeService.getDSDossiers(procedureId, page, resultPerPage).pipe(
            flatMap(res => {
                logger.debug(`[SyncService.updateDossiers] procedure #${res.procedureId} - page ${page} / resultPerPage ${resultPerPage}: ${res.dossiers.length} dossiers`);
                return res.dossiers;
            }, (res, dossier) => this.buildDossierUpdateInfo(res, dossier)),
            mergeMap((res: DossierUpdateInfo<DSDossierItem>) => dossierService.findOne(res.procedureId, res.dossierId)
                , (outer: DossierUpdateInfo<DSDossierItem>, inner: DossierRecord | null) => this.updateDossierUpdateInfo(outer, inner)),
            filter((res: DossierUpdateInfo<DossierRecord>) => {
                const updated = this.shouldBeUpdated(res)
                logger.info(`[SyncService.updateDossiers] procedure #${res.procedureId} > dossier ${res.dossierId} update ${updated}`);
                return updated;
            }),
            concatMap((res: DossierUpdateInfo<DossierRecord>) => this.updateDossier(res.procedureId, res.dossierId || ''))
        );
    }

    private buildDossierUpdateInfo(res: DossierListResult, dossier: DSDossierItem): DossierUpdateInfo<DSDossierItem> {
        if (!dossier.id) {
            throw new Error('id should not be null.');
        }
        return { procedureId: res.procedureId, dossierId: dossier.id, updatedDate: asTimestamp(dossier.updated_at) || 0, data: dossier };
    }

    private updateDossierUpdateInfo(outer: DossierUpdateInfo<DSDossierItem>, inner: DossierRecord | null): DossierUpdateInfo<DossierRecord> {
        return { procedureId: outer.procedureId, dossierId: outer.dossierId, updatedDate: outer.updatedDate, data: inner };
    }

    private shouldBeUpdated(res: DossierUpdateInfo<DossierRecord>): boolean {
        if (!res.data) {
            return true;
        } if (!res.data.metadata.updated_at) {
            return true;
        }
        logger.debug(`[SyncService.shouldBeUpdated] updatedDate: DS ${res.updatedDate} - KINTO ${res.data.metadata.updated_at}`);
        return res.updatedDate > res.data.metadata.updated_at;
    }

    private updateProcedure(procedureId: string): Observable<Record<DSDossier>> {
        return demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
            tap((res) => logger.info(`[SyncService.updateProcedure] procedure #${res.id} dossier number ${res.total_dossier}`)),
            switchMap((res: DSProcedure) => procedureService.saveOrUpdate(res)),
            tap((res: Record<DSProcedure>) => logger.debug(`[SyncService.updateProcedure] procedure #${res.ds_data.id} - created / updated into KINTO with id ${res.id}`)),
            flatMap((res: Record<DSProcedure>) => {
                const resultPerPage = 500;
                const maxPageNumber = Math.ceil(res.ds_data.total_dossier / resultPerPage);
                const result = [];

                for (let page = 1; page <= maxPageNumber; page++) {
                    logger.debug(`[SyncService.updateProcedure] procedure #${res.ds_data.id} - add params: page ${page} / ${maxPageNumber}, resultPerPage ${resultPerPage}`)
                    result.push({ procedureId: res.ds_data.id, resultPerPage, page });
                }
                return result;
            }),
            concatMap((res) => this.updateDossiers(res.procedureId || '', res.page, res.resultPerPage))
        );
    };

}


interface DossierUpdateInfo<T> { procedureId: string, dossierId: string, updatedDate: number, data: T | null }

export const syncService = new SyncService();