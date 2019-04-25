import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as handlers from 'typed-rest-client/Handlers';
import * as rm from 'typed-rest-client/RestClient';
import { configuration } from "../../util";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

interface DSDossierListResult {
    dossiers: DSDossierItem[];
    pagination: {
        "page": number,
        "resultats_par_page": number,
        "nombre_de_page": number
    }
}

interface DSDossierResult {
    dossier: DSDossier;
}

interface DSProcedureResult {
    procedure: DSProcedure;
}

class DemarcheSimplifieeAPI {

    private dsAPI = configuration.dsAPI;
    private token = configuration.dsToken || '';
    private client: rm.RestClient;

    constructor() {
        const bearer = new handlers.BearerCredentialHandler(this.token);
        this.client = new rm.RestClient('ds-api', this.dsAPI, [bearer], undefined);
    }

    public getDSProcedure(procedureId: string | number): Observable<DSProcedureResult> {
        return from(this.client.get<any>(`/api/v1/procedures/${procedureId}`)).pipe(
            map(this.handleResult<DSProcedureResult>('getDSProcedure'))
        );
    }

    public getDSDossiers(procedureId: string | number, page: number, resultPerPage: number): Observable<DSDossierListResult> {
        return from(this.client.get<DSDossierListResult>(`/api/v1/procedures/${procedureId}/dossiers?page=${page}&resultats_par_page=${resultPerPage}`)).pipe(
            map(this.handleResult<DSDossierListResult>('getDSDossiers', {
                dossiers: [], pagination: {
                    "nombre_de_page": 0,
                    "page": 0,
                    "resultats_par_page": 0
                }
            })),
        );
    }

    public getDSDossier(procedureId: string | number, DSdossierId: string | number): Observable<DSDossierResult> {
        return from(this.client.get<DSDossierResult>(`/api/v1/procedures/${procedureId}/dossiers/${DSdossierId}`)).pipe(
            map(this.handleResult<DSDossierResult>('getDSDossier'))
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
