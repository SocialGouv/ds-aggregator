import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';
import { DSDossier, DSProcedure } from "../model";
import { configuration } from "../../util";

export interface IDemarcheSimplifieeAPI {
    getDSProcedure: (DSprocedureId: string | number) => Observable<DSProcedure | null>;
    getDSDossiers: (DSprocedureId: string) => Observable<DSDossier[] | null>;
    getDSDossier: (DSprocedureId: string, DSdossierId: string) => Observable<DSDossier | null>
}

class DemarcheSimplifieeAPI implements IDemarcheSimplifieeAPI {

    private dsAPI = configuration.dsAPI;
    private token = configuration.dsToken || '';
    private client: rm.RestClient;

    constructor() {
        const bearer = new handlers.BearerCredentialHandler(this.token);
        this.client = new rm.RestClient('ds-api', this.dsAPI, [bearer], undefined);
    }

    public getDSProcedure(procedureId: string | number): Observable<DSProcedure | null> {
        return from(this.client.get<any>(`/api/v1/procedures/${procedureId}`)).pipe(
            map((res: rm.IRestResponse<any>) => res.result.procedure)
        );
    }

    public getDSDossiers(DSprocedureId: string | number): Observable<DSDossier[] | null> {
        return from(this.client.get<DSDossier[]>(`/api/v1/procedures/${DSprocedureId}/procedures/${DSprocedureId}/DSdossiers`)).pipe(
            map((res) => res.result)
        );
    }

    public getDSDossier(DSprocedureId: string | number, DSdossierId: string | number): Observable<DSDossier | null> {
        return from(this.client.get<DSDossier>(`/api/v1/procedures/${DSprocedureId}/dossiers/${DSdossierId}`)).pipe(
            map((res) => res.result)
        );
    }

}

export default new DemarcheSimplifieeAPI();
