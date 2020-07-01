import { Observable, of } from "rxjs";
import { concatMap, flatMap, reduce } from "rxjs/operators";
import { ProcedureRecord } from "../collector/model";
import {
  demarcheSimplifieeService,
  DSDossierItem,
} from "../demarche-simplifiee";
import { DossierListResult } from "../demarche-simplifiee/service/ds.service";
import { logger } from "../util";

class SyncService {
  public allDossierItems(record: ProcedureRecord): Observable<DSDossierItem[]> {
    return of(this.buildPages(record)).pipe(
      flatMap((x: PageOption[]) => x),
      concatMap((pageOption: PageOption) =>
        demarcheSimplifieeService.getDSDossiers(
          pageOption.procedureId,
          pageOption.page,
          pageOption.resultPerPage
        )
      ),
      reduce((acc: DSDossierItem[], dossieristResult: DossierListResult) => {
        Array.prototype.push.apply(acc, dossieristResult.dossiers);
        return acc;
      }, [])
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
}

interface PageOption {
  procedureId: number;
  resultPerPage: number;
  page: number;
}

export const syncService = new SyncService();
