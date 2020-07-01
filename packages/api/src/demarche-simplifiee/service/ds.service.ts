import { Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { Http404Error } from "../../lib/rest";
import { demarcheSimplifieeAPI } from "../api";
import { DSDossierResult, DSProcedureResult } from "../api/ds.api";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

class DemarcheSimplifieeService {
  public getDSProcedure(procedureId: number): Observable<DSProcedure> {
    return demarcheSimplifieeAPI
      .getDSProcedure(procedureId)
      .pipe(map((res: DSProcedureResult) => res.procedure));
  }

  public getDSDossiers(
    procedureId: number,
    page: number,
    resultPerPage: number
  ): Observable<DossierListResult> {
    const input: {
      procedureId: number;
      page: number;
      resultPerPage: number;
    } = { procedureId, page, resultPerPage };
    return of(input).pipe(
      mergeMap(
        (ctx: { procedureId: number; page: number; resultPerPage: number }) =>
          demarcheSimplifieeAPI.getDSDossiers(
            ctx.procedureId,
            ctx.page,
            ctx.resultPerPage
          ),
        (ctx, res) => ({
          dossierItems: res.dossiers,
          procedureId: ctx.procedureId,
        })
      ),
      map((res: { procedureId: number; dossierItems: DSDossierItem[] }) => ({
        dossiers: res.dossierItems,
        procedureId: res.procedureId,
      }))
    );
  }

  public getDSDossier(
    procedureId: number,
    dossierId: number
  ): Observable<DSDossier | null> {
    return demarcheSimplifieeAPI.getDSDossier(procedureId, dossierId).pipe(
      map((res: DSDossierResult) => res.dossier),
      catchError((err: any) => {
        if (err instanceof Http404Error) {
          return of(null);
        }
        throw err;
      })
    );
  }
}

export interface DossierListResult {
  dossiers: DSDossierItem[];
  procedureId: number;
}

export default new DemarcheSimplifieeService();
