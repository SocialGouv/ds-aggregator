import { from, Observable } from "rxjs";
import * as rm from 'typed-rest-client/RestClient';
import { Dossier, Procedure } from "../model";
import { configuration } from "../util";
import * as handlers from 'typed-rest-client/Handlers'

export interface IApiDS {
    getProcedure: (procedureId: string) => Observable<Procedure>;
    getDossiers: (procedureId: string) => Observable<Dossier>;
    getDossier: (procedureId: string, dossierId: string) => Observable<Dossier>
}

class DemarcheSimplifieeAPI {

    private dsAPI = configuration.dsAPI;
    private token = configuration.dsToken || '';
    private client: rm.RestClient;

    constructor() {
        const bearer = new handlers.BearerCredentialHandler(this.token);
        this.client = new rm.RestClient('ds-api', this.dsAPI, [bearer], undefined);
    }

    public getProcedure(procedureId: string | number): Observable<rm.IRestResponse<Procedure>> {
        return from(this.client.get<Procedure>(`/api/v1/procedures/${procedureId}`));
    }

    // public getDossiers(procedureId: string | number): Observable<Dossier[]> {
    //     return Observable.from(get(`${this.procedureAPI}/procedures/${procedureId}/dossiers`));
    // }

    // public getDossier(procedureId: string | number, dossierId: string | number): Observable<Dossier[]> {
    //     return Observable.from(get(`${this.procedureAPI}/procedures/${procedureId}/dossiers/${dossierId}`));
    // }

}

export default new DemarcheSimplifieeAPI();
