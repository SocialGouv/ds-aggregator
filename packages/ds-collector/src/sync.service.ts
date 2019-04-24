import { Observable, of } from "rxjs";
import { concatMap, flatMap, mergeMap, tap } from "rxjs/operators";
import { demarcheSimplifieeService, DSDossier, DSDossierItem, DSProcedure } from "./demarche-simplifiee";
import { configuration, logger } from "./util";
import { wifDossierService, wifProcedureService, WIFRecord } from "./work-in-france";


class CollectorSyncService {

    public updateDossier(procedureId: string, dossierId: string): Observable<WIFRecord<DSDossier>> {
        return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
            tap((res: DSDossier) => logger.info(`[COLLECTOR] procedure #${procedureId} > dossier ${res.id} loaded from DS`)),
            mergeMap((res: DSDossier) => wifDossierService.saveOrUpdate(procedureId, res)),
            tap((res: WIFRecord<DSDossier>) => logger.info(`[COLLECTOR] procedure #${procedureId} > dossier ${res.ds_data.id} created / updated into KINTO with id ${res.id}`))
        );
    }

    public syncAll() {
        this.procedureIds().pipe(
            tap((procedureId) => logger.info(`[COLLECTOR] START procedure #${procedureId}]`)),
            concatMap((procedureId) => this.updateProcedure(procedureId))
            // tslint:disable-next-line: no-empty
        ).subscribe(() => {

        }, (error: any) => {
            logger.error(error);
        }, () => {
            logger.info(`[COLLECTOR] END`)
        });
    }

    private procedureIds(): Observable<string> {
        return of(configuration.dsProcedureIds).pipe(
            flatMap(x => x),
        );
    }

    private updateDossiers(procedureId: string) {
        return demarcheSimplifieeService.getDSDossiers(procedureId).pipe(
            tap((res: DSDossierItem[]) => logger.info(`[COLLECTOR] procedure #${procedureId} - ${res.length} dossiers`)),
            flatMap(x => x),
            concatMap((res: DSDossierItem) => this.updateDossier(procedureId, res.id || ''))
        );
    }

    private updateProcedure(procedureId: string) {
        return demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
            tap(() => logger.info(`[COLLECTOR] procedure #${procedureId} - loaded from DS`)),
            mergeMap((res: DSProcedure) => wifProcedureService.saveOrUpdate(res)),
            tap((res: WIFRecord<DSProcedure>) => logger.info(`[COLLECTOR] procedure #${procedureId} - created / updated into KINTO with id ${res.id}`)),
            concatMap((res: WIFRecord<DSProcedure>) => this.updateDossiers(res.ds_data.id))
        );
    };

}

export const syncService = new CollectorSyncService();