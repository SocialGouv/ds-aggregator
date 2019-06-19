import { Observable } from "rxjs";
import {
  concatMap,
  exhaustMap,
  filter,
  flatMap,
  reduce,
  tap
} from "rxjs/operators";
import {
  DossierRecord,
  dsProcedureConfigService,
  ProcedureConfig,
  ProcedureRecord,
  procedureService
} from "../collector";
import { statisticService } from "../collector/service/statistic.service";
import { configuration } from "../config";
import {
  demarcheSimplifieeService,
  DSDossierItem,
  DSProcedure
} from "../demarche-simplifiee";
import { DossierListResult } from "../demarche-simplifiee/service/ds.service";
import { asTimestamp, logger } from "../util";
import { dossierSynchroService } from "./dossier-synchro.service";
import { handleScheduler } from "./scheduler.service";

export const dossierScheduler = {
  start: () => {
    handleScheduler(
      configuration.schedulerCronDS,
      "dossier-synchro",
      (start: number) => {
        return allDossierItemInfosWithUpdatedDateGreatherThan(start).pipe(
          concatMap((res: DossierItemInfo) =>
            dossierSynchroService.syncDossier(res.procedureId, res.dossierId)
          ),
          reduce((acc: DossierRecord[], record: DossierRecord) => {
            acc.push(record);
            return acc;
          }, []),
          exhaustMap(() => statisticService.statistic())
        );
      }
    );
  }
};

interface PageOption {
  procedureId: string;
  resultPerPage: number;
  page: number;
}
interface DossierItemInfo {
  procedureId: string;
  dossierId: string;
  updatedDate: number;
}

function syncProcedures(): Observable<ProcedureRecord> {
  return allDemarcheSimlifieeProcedures().pipe(
    concatMap(procedureService.saveOrUpdate)
  );
}

function allDemarcheSimlifieeProcedures(): Observable<DSProcedure> {
  return dsProcedureConfigService.all().pipe(
    flatMap((x: ProcedureConfig[]) => x),
    flatMap((x: ProcedureConfig) => x.procedures),
    concatMap(demarcheSimplifieeService.getDSProcedure),
    tap((res: DSProcedure) =>
      logger.info(
        `[SyncService.allDemarcheSimlifieeProcedures] procedure#${res.id} - ${res.total_dossier} dossiers`
      )
    )
  );
}

function allDemarcheSimplifieeDossierItems(): Observable<DossierItemInfo> {
  return syncProcedures().pipe(
    flatMap(buildPages),
    concatMap((pageOption: PageOption) =>
      demarcheSimplifieeService.getDSDossiers(
        pageOption.procedureId,
        pageOption.page,
        pageOption.resultPerPage
      )
    ),
    flatMap(
      (res: DossierListResult) => res.dossiers,
      (res, dossier) => buildDossierUpdateInfo(res, dossier)
    )
  );
}

function allDossierItemInfosWithUpdatedDateGreatherThan(
  start: number = 0
): Observable<DossierItemInfo> {
  return allDemarcheSimplifieeDossierItems().pipe(
    filter((res: DossierItemInfo) => res.updatedDate > start),
    tap((res: DossierItemInfo) =>
      logger.info(
        `[SyncService.allDossierItemInfos] dossier ${res.procedureId}-${res.dossierId} will be synchronised`
      )
    )
  );
}

function buildPages(res: ProcedureRecord): PageOption[] {
  const resultPerPage = 500;
  const maxPageNumber = Math.ceil(res.ds_data.total_dossier / resultPerPage);
  const result: PageOption[] = [];

  for (let page = 1; page <= maxPageNumber; page++) {
    logger.debug(
      `[SyncService.buildPages] procedure #${res.ds_data.id} - add params: ` +
        `page ${page} / ${maxPageNumber}, resultPerPage ${resultPerPage}`
    );
    result.push({ procedureId: res.ds_data.id || "", resultPerPage, page });
  }
  return result;
}

function buildDossierUpdateInfo(
  res: DossierListResult,
  dossier: DSDossierItem
): DossierItemInfo {
  if (!dossier.id) {
    throw new Error("id should not be null.");
  }
  return {
    dossierId: dossier.id,
    procedureId: res.procedureId,
    updatedDate: asTimestamp(dossier.updated_at) || 0
  };
}
