import { flatMap, mergeMap, tap } from "rxjs/operators";
import { demarcheSimplifieeService, DSDossier, DSDossierItem, DSProcedure } from "./demarche-simplifiee";
import { logger } from "./util";
import { WIFRecord } from "./work-in-france/model";
import { wifProcedureService } from "./work-in-france/service";
import wifDossierService from "./work-in-france/service/wif-dossier.service";

const procedureId = '9407';

logger.info(`[SYNC] START`)

demarcheSimplifieeService.getDSProcedure(procedureId).pipe(
    tap(() => logger.info(`[PROCEDURE #${procedureId}] loaded from DS`)),
    mergeMap((res: DSProcedure) => wifProcedureService.saveOrUpdate(res)),
    tap((res: WIFRecord<DSProcedure>) => logger.info(`[PROCEDURE #${procedureId}] created / updated into KINTO with id ${res.id}`)),
    mergeMap((res: WIFRecord<DSProcedure>) => demarcheSimplifieeService.getDSDossiers(res.ds_data.id)),
    tap((res: DSDossierItem[]) => logger.info(`[PROCEDURE #${procedureId}] ${res.length} dossiers`)),
    flatMap(x => x),
    mergeMap((res: DSDossierItem) => demarcheSimplifieeService.getDSDossier(procedureId, res.id)),
    tap((res: DSDossier) => logger.info(`[PROCEDURE #${procedureId} > DOSSIER ${res.id}] loaded from DS`)),
    mergeMap((res: DSDossier) => wifDossierService.saveOrUpdate(procedureId, res)),
    tap((res: WIFRecord<DSDossier>) => logger.info(`[PROCEDURE #${procedureId} > DOSSIER ${res.ds_data.id}] created / updated into KINTO with id ${res.id}`)),
).subscribe(() => {

}, (error: any) => {
    logger.error(error);
}, () => {
    logger.info(`[SYNC] COMPLETE`)
});

