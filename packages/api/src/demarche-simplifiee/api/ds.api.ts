import { Observable } from "rxjs";
import { configuration } from "../../config";
import { RestClient } from "../../lib/rest";
import { DSDossier, DSDossierItem, DSProcedure } from "../model";

interface DSDossierListResult {
  dossiers: DSDossierItem[];
  pagination: {
    page: number;
    resultats_par_page: number;
    nombre_de_page: number;
  };
}

export interface DSDossierResult {
  dossier: DSDossier;
}

export interface DSProcedureResult {
  procedure: DSProcedure;
}

class DemarcheSimplifieeAPI {
  private client: RestClient;

  constructor() {
    this.client = new RestClient(
      configuration.dsAPI || "",
      configuration.dsToken || ""
    );
  }

  public getDSProcedure(
    procedureId: string | number
  ): Observable<DSProcedureResult> {
    return this.client.get<any>(`/api/v1/procedures/${procedureId}`);
  }

  public getDSDossiers(
    procedureId: string | number,
    page: number,
    resultPerPage: number
  ): Observable<DSDossierListResult> {
    return this.client.get<DSDossierListResult>(
      `/api/v1/procedures/${procedureId}/dossiers?page=${page}&resultats_par_page=${resultPerPage}`
    );
  }

  public getDSDossier(
    procedureId: string | number,
    DSdossierId: string | number
  ): Observable<DSDossierResult> {
    return this.client.get<DSDossierResult>(
      `/api/v1/procedures/${procedureId}/dossiers/${DSdossierId}`
    );
  }
}

export default new DemarcheSimplifieeAPI();
