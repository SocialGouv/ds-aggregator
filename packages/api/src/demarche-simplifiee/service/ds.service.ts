import { Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { demarcheSimplifieeAPI } from "../api";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

class DemarcheSimplifieeService {

    public getDSProcedure(procedureId: string): Observable<DSProcedure> {
        return demarcheSimplifieeAPI.getDSProcedure(procedureId).pipe(
            map((res) => res.procedure)
        )
    }

    public getDSDossiers(procedureId: string, page: number, resultPerPage: number): Observable<DossierListResult> {
        return of({ procedureId, page, resultPerPage }).pipe(
            mergeMap((ctx) => demarcheSimplifieeAPI.getDSDossiers(ctx.procedureId, ctx.page, ctx.resultPerPage),
                (ctx, res) => ({ ctx, res })),
            map(({ ctx, res }) => ({ dossiers: res.dossiers, procedureId: ctx.procedureId }))
        )
    }

    public getDSDossier(procedureId: string, dossierId: string): Observable<{ dossier: DSDossier, procedureId: string }> {
        return of({ procedureId, dossierId }).pipe(
            mergeMap((ctx) => demarcheSimplifieeAPI.getDSDossier(ctx.procedureId, ctx.dossierId), (ctx, res) => ({ ctx, res })),
            map(({ ctx, res }) => ({ dossier: res.dossier, procedureId: ctx.procedureId }))
        )
    }

}

export interface DossierListResult {
    dossiers: DSDossierItem[], procedureId: string
}

export default new DemarcheSimplifieeService();