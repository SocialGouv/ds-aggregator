import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';
import { configuration } from "../../util";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

export interface IDemarcheSimplifieeAPI {
    getDSProcedure: (DSprocedureId: string | number) => Observable<DSProcedure>;
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

    public getDSProcedure(procedureId: string | number): Observable<DSProcedure> {
        return from(this.client.get<any>(`/api/v1/procedures/${procedureId}`)).pipe(
            map((res: rm.IRestResponse<any>) => res.result.procedure)
        );
    }

    public getDSDossiers(procedureId: string | number): Observable<DSDossierItem[]> {
        return from(this.client.get<DSDossierItem[]>(`/api/v1/procedures/${procedureId}/procedures/${procedureId}/dossiers`)).pipe(
            map(this.handleResult<DSDossierItem[]>('getDSDossiers', [])),

        );
    }

    public getDSDossier(procedureId: string | number, DSdossierId: string | number): Observable<DSDossier> {
        return from(this.client.get<DSDossier>(`/api/v1/procedures/${procedureId}/dossiers/${DSdossierId}`)).pipe(
            map(this.handleResult<DSDossier>('getDSDossier'))
        );
    }

    private handleResult<T>(source: string, defaultValue?: T): (value: rm.IRestResponse<T>) => T {
        return (res: rm.IRestResponse<T>) => {
            if (res.result) {
                return res.result;
            }
            if (defaultValue) {
                return defaultValue;
            }
            throw new Error(`[DS-API.${source}] request result is null`);
        };
    }

}

export default new DemarcheSimplifieeAPI();
