import { Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { demarcheSimplifieeAPI } from "../api";
import { DSDossierResult, DSProcedureResult } from "../api/ds.api";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

class DemarcheSimplifieeService {
  public getDSProcedure(procedureId: string): Observable<DSProcedure> {
    return demarcheSimplifieeAPI
      .getDSProcedure(procedureId)
      .pipe(map((res: DSProcedureResult) => res.procedure));
  }

  public getDSDossiers(
    procedureId: string,
    page: number,
    resultPerPage: number
  ): Observable<DossierListResult> {
    return of({ procedureId, page, resultPerPage }).pipe(
      mergeMap(
        (ctx: any) =>
          demarcheSimplifieeAPI.getDSDossiers(
            ctx.procedureId,
            ctx.page,
            ctx.resultPerPage
          ),
        (ctx, res) => ({ ctx, res })
      ),
      map(({ ctx, res }) => ({
        dossiers: res.dossiers,
        procedureId: ctx.procedureId
      }))
    );
  }

  public getDSDossier(
    procedureId: string,
    dossierId: string
  ): Observable<DSDossier> {
    return demarcheSimplifieeAPI
      .getDSDossier(procedureId, dossierId)
      .pipe(map((res: DSDossierResult) => res.dossier));
  }
}

export interface DossierListResult {
  dossiers: DSDossierItem[];
  procedureId: string;
}

export default new DemarcheSimplifieeService();
