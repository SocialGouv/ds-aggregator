import { Observable } from "rxjs";
import { ProcedureConfig } from "../model";
import { dsProcedureConfigRepository } from "../repository";

class DSProcedureConfigService {

    public all(): Observable<ProcedureConfig[]> {
        return dsProcedureConfigRepository.all();
    }

}

export const dsProcedureConfigService = new DSProcedureConfigService();