import { Observable, of } from "rxjs";
import { concatMap, flatMap } from "rxjs/operators";
import { ProcedureRecord } from "../collector/model";
import {
  demarcheSimplifieeService,
  DSDossierItem
} from "../demarche-simplifiee";
import { DossierListResult } from "../demarche-simplifiee/service/ds.service";
import { asTimestamp, logger } from "../util";

class SyncService {
  public allDossierItemInfos(
    record: ProcedureRecord
  ): Observable<DossierItemInfo> {
    return of(this.buildPages(record)).pipe(
      flatMap((x: PageOption[]) => x),
      concatMap((pageOption: PageOption) =>
        demarcheSimplifieeService.getDSDossiers(
          pageOption.procedureId,
          pageOption.page,
          pageOption.resultPerPage
        )
      ),
      flatMap(
        (res: DossierListResult) => res.dossiers,
        (res, dossier) => this.buildDossierUpdateInfo(res, dossier)
      )
    );
  }

  private buildPages(res: ProcedureRecord): PageOption[] {
    const resultPerPage = 500;
    const maxPageNumber = Math.ceil(res.ds_data.total_dossier / resultPerPage);
    const result: PageOption[] = [];

    for (let page = 1; page <= maxPageNumber; page++) {
      logger.debug(
        `[SyncService.buildPages] procedure #${res.ds_data.id} - add params: ` +
          `page ${page} / ${maxPageNumber}, resultPerPage ${resultPerPage}`
      );
      result.push({ procedureId: res.ds_data.id, resultPerPage, page });
    }
    return result;
  }

  private buildDossierUpdateInfo(
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
}

interface PageOption {
  procedureId: number;
  resultPerPage: number;
  page: number;
}
export interface DossierItemInfo {
  procedureId: number;
  dossierId: number;
  updatedDate: number;
}

export const syncService = new SyncService();
