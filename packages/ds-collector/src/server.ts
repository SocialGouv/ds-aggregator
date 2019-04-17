import { flatMap, mergeMap, tap } from "rxjs/operators";
import { demarcheSimplifieeAPI, DSDossierItem, DSProcedure, DSDossier } from "./demarche-simplifiee";
import { logger } from "./util";
import { WIFRecord } from "./work-in-france/model";
import { wifProcedureService } from "./work-in-france/service";
import wifDossierService from "./work-in-france/service/wif-dossier.service";

const procedureId = 9407;

demarcheSimplifieeAPI.getDSProcedure(procedureId).pipe(
    tap(() => logger.info(`[procedure #${procedureId}] loaded from DS` )),
    mergeMap((res: DSProcedure) => wifProcedureService.saveOrCreate(res)),
    tap((res: WIFRecord<DSProcedure>) => logger.info(`[procedure #${procedureId}] ${res.id} created / updated into KINTO` )),
    mergeMap((res: WIFRecord<DSProcedure>) => demarcheSimplifieeAPI.getDSDossiers(res.ds_data.id)),
    tap((res: DSDossierItem[]) => logger.info(`[procedure #${procedureId}] ${res.length} dossiers` )),
    flatMap(x => x),
    tap((res: DSDossierItem) => logger.info(`[procedure #${procedureId}] loading dossier ${res.id}` )),
    mergeMap((res: DSDossierItem) => demarcheSimplifieeAPI.getDSDossier(procedureId, res.id)),
    tap((res: DSDossier) => logger.info(`[procedure #${procedureId}] saving or updating dossier ${res.id}` )),
    mergeMap((res: DSDossier) => wifDossierService.saveOrCreate(procedureId, res))
).subscribe();

