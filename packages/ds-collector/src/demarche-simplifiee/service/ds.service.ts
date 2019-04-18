import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { demarcheSimplifieeAPI } from "../api";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

class DemarcheSimplifieeService {

    public getDSProcedure(procedureId: string): Observable<DSProcedure> {
        return demarcheSimplifieeAPI.getDSProcedure(procedureId).pipe(
            map((res) => res.procedure)
        )
    }

    public getDSDossiers(procedureId: string): Observable<DSDossierItem[]> {
        return demarcheSimplifieeAPI.getDSDossiers(procedureId).pipe(
            map((res) => res.dossiers)
        )
    }

    public getDSDossier(procedureId: string, dossierId: string): Observable<DSDossier> {
        return demarcheSimplifieeAPI.getDSDossier(procedureId, dossierId).pipe(
            map((res) => res.dossier)
        )
    }

}

export default new DemarcheSimplifieeService();