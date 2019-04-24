import { of } from "rxjs";
import { concatMap, flatMap, mergeMap, tap } from "rxjs/operators";
import { demarcheSimplifieeService, DSDossier, DSDossierItem, DSProcedure } from "./demarche-simplifiee";
import { configuration, logger } from "./util";
import { WIFRecord } from "./work-in-france/model";
import { wifProcedureService } from "./work-in-france/service";
import wifDossierService from "./work-in-france/service/wif-dossier.service";

const procedureIds$ = of(configuration.dsProcedureIds).pipe(
    flatMap(x => x),
);

const updateDossier$ = (procedureId: string, dossierId: string) => {
    return demarcheSimplifieeService.getDSDossier(procedureId, dossierId).pipe(
        tap((res: DSDossier) => logger.info(`[COLLECTOR] procedure #${procedureId} > dossier ${res.id} loaded from DS`)),
        mergeMap((res: DSDossier) => wifDossierService.saveOrUpdate(procedureId, res)),
        tap((res: WIFRecord<DSDossier>) => logger.info(`[COLLECTOR] procedure #${procedureId} > dossier ${res.ds_data.id} created / updated into KINTO with id ${res.id}`))
    );
}

const updateDossiers$ = (procedureId: string) => {
    return demarcheSimplifieeService.getDSDossiers(procedureId).pipe(
        tap((res: DSDossierItem[]) => logger.info(`[COLLECTOR] procedure #${procedureId} - ${res.length} dossiers`)),
        flatMap(x => x),
        concatMap((res: DSDossierItem) => updateDossier$(procedureId, res.id || ''))
    );
}

const updateProcedure$ = (procedureId: string) => {
    return demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
        tap(() => logger.info(`[COLLECTOR] procedure #${procedureId} - loaded from DS`)),
        mergeMap((res: DSProcedure) => wifProcedureService.saveOrUpdate(res)),
        tap((res: WIFRecord<DSProcedure>) => logger.info(`[COLLECTOR] procedure #${procedureId} - created / updated into KINTO with id ${res.id}`)),
        concatMap((res: WIFRecord<DSProcedure>) => updateDossiers$(res.ds_data.id))
    );
};

procedureIds$.pipe(
    tap((procedureId) => logger.info(`[COLLECTOR] START procedure #${procedureId}]`)),
    concatMap((procedureId) => updateProcedure$(procedureId))
// tslint:disable-next-line: no-empty
).subscribe(() => {

}, (error: any) => {
    logger.error(error);
}, () => {
    logger.info(`[COLLECTOR] END`)
});




