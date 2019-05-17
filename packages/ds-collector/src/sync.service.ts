import { Observable, of, Subject } from "rxjs";
import { concatMap, exhaustMap, filter, flatMap, mergeMap, reduce, tap } from "rxjs/operators";
import { DossierRecord, dossierService, dsProcedureConfigService, ProcedureRecord, procedureService, Task, taskService } from "./collector";
import { statisticService } from "./collector/service/statistic.service";
import { demarcheSimplifieeService, DSDossierItem, DSProcedure } from "./demarche-simplifiee";
import { DossierListResult } from "./demarche-simplifiee/service/ds.service";
import { logger } from "./util";
import { asNumber, asTimestamp } from "./util/converter";

class SyncService {

    private refreshStatistics$ = new Subject();
    private syncAllDossiers$ = new Subject();

    constructor() {
        this.initRefreshStatistics();
        this.initDossiersSynchronisation();
    }

    public launchGlobalSynchronisation() {
        this.syncAllDossiers$.next();
    }

    public launchStatisticsComputation() {
        this.refreshStatistics$.next();
    }

    public handleTaskToComplete() {
        this.allTasksToComplete().pipe(
            concatMap(this.syncDossierAndCompleteTask),
        ).subscribe({
            complete: () => {
                logger.info(`[SyncService.handleTaskToCompletes] tasks with success`);
                this.refreshStatistics$.next();
            },
            error: (error: any) => {
                logger.error(`[SyncService.handleTaskToCompletes] error: `, error);
            },
            next: (next: Task) => {
                logger.info(`[SyncService.handleTaskToCompletes] task ${next.procedure_id}-${next.dossier_id} completed`);
            }
        })
    }

    private initRefreshStatistics() {
        this.refreshStatistics$.pipe(
            exhaustMap(() => statisticService.statistic())
        ).subscribe({
            complete: () => {
                logger.info(`[SyncService.statistics] statistics refreshed`);
            },
            error: (error: any) => {
                logger.error(`[SyncService.statistics] error: `, error);
            }
        });
    }

    private initDossiersSynchronisation() {
        this.syncAllDossiers$.pipe(
            exhaustMap(_ => this.syncDossiers()),
            tap(() => this.refreshStatistics$.next())
        ).subscribe(
            {
                error: (error: any) => {
                    logger.error(`[SyncService.syncAllDossiers] error: `, error);
                },
                next: (next: DossierRecord[]) => {
                    logger.info(`[SyncService.syncAllDossiers] ${next.length} records synchronized`);
                }
            }
        )
    }

    private syncDossiers(): Observable<DossierRecord[]> {
        return this.allDossierItemInfos().pipe(
            concatMap(res => this.syncDossier(res.procedureId, res.dossierId)),
            reduce((acc: DossierRecord[], record: DossierRecord) => {
                acc.push(record);
                return acc;
            }, [])
        );
    }

    private syncProcedures(): Observable<ProcedureRecord> {
        return this.allDemarcheSimlifieeProcedures().pipe(
            concatMap(procedureService.saveOrUpdate),
        )
    }

    private allDemarcheSimlifieeProcedures(): Observable<DSProcedure> {
        return dsProcedureConfigService.all().pipe(
            flatMap(x => x),
            flatMap(x => x.procedures),
            concatMap(demarcheSimplifieeService.getDSProcedure),
            tap(res => logger.info(`[SyncService.allDemarcheSimlifieeProcedures] procedure#${res.id} - ${res.total_dossier} dossiers`))
        )
    }

    private allDemarcheSimplifieeDossierItems(): Observable<DossierItemInfo> {
        return this.syncProcedures().pipe(
            flatMap(this.buildPages),
            concatMap(pageOption => demarcheSimplifieeService.getDSDossiers(pageOption.procedureId, pageOption.page, pageOption.resultPerPage)),
            flatMap(res => res.dossiers, (res, dossier) => this.buildDossierUpdateInfo(res, dossier)),
        )
    }

    private allDossierItemInfos(): Observable<DossierItemInfo> {
        return this.allDemarcheSimplifieeDossierItems().pipe(
            concatMap((res: DossierItemInfo) => dossierService.findOne(res.procedureId, res.dossierId)
                , (outer: DossierItemInfo, inner: DossierRecord | null) => { outer.record = inner; return outer; }),
            filter(this.shouldBeUpdated),
            tap((res) => logger.info(`[SyncService.allDossierItemInfos] dossier ${res.procedureId}-${res.dossierId} will be synchronised`))
        )
    }

    private allTasksToComplete(): Observable<Task> {
        return taskService.getTasksToComplete().pipe(
            flatMap(x => x)
        );
    }

    private buildPages(res: ProcedureRecord): PageOption[] {
        const resultPerPage = 500;
        const maxPageNumber = Math.ceil(res.ds_data.total_dossier / resultPerPage);
        const result: PageOption[] = [];

        for (let page = 1; page <= maxPageNumber; page++) {
            logger.debug(`[SyncService.buildPages] procedure #${res.ds_data.id} - add params: page ${page} / ${maxPageNumber}, resultPerPage ${resultPerPage}`)
            result.push({ procedureId: res.ds_data.id || '', resultPerPage, page });
        }
        return result;
    }

    private syncDossier(procedureId: string, dossierId: string): Observable<DossierRecord> {
        return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
            mergeMap((dsDossier) => dsProcedureConfigService.findByProcedureId(asNumber(dsDossier.procedureId, 0)),
                (dsDossier, configs) => ({ ...dsDossier, group: configs[0].group })),
            mergeMap((param) => dossierService.saveOrUpdate(param.group, param.procedureId, param.dossier)),
            tap((dossier) => logger.info(`[SyncService.syncDossier] dossier ${dossier.ds_key} synchronised`))
        );
    }

    private syncDossierAndCompleteTask(task: Task) {
        return of(task).pipe(
            mergeMap((t: Task) => this.syncDossier(t.procedure_id, t.dossier_id), (outer, inner) => ({ task: outer, dossier: inner })),
            mergeMap(res => taskService.markAsCompleted(res.task))
        );
    }

    private buildDossierUpdateInfo(res: DossierListResult, dossier: DSDossierItem): DossierItemInfo {
        if (!dossier.id) {
            throw new Error('id should not be null.');
        }
        return { procedureId: res.procedureId, dossierId: dossier.id, updatedDate: asTimestamp(dossier.updated_at) || 0 };
    }


    private shouldBeUpdated(res: DossierItemInfo): boolean {
        if (!res.record) {
            return true;
        } if (!res.record.metadata.updated_at) {
            return true;
        }
        return res.updatedDate > res.record.metadata.updated_at;
    }

}

interface PageOption { procedureId: string, resultPerPage: number, page: number }
interface DossierItemInfo { procedureId: string, dossierId: string, updatedDate: number, record?: DossierRecord | null }

export const syncService = new SyncService();