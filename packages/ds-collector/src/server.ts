import { NEVER } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { demarcheSimplifieeAPI, DSProcedure } from "./demarche-simplifiee";
import { logger } from "./util";
import { wifProcedureService } from "./work-in-france/service";
import { WIFRecord } from "./work-in-france/model";

demarcheSimplifieeAPI.getDSProcedure(9407).pipe(
    switchMap((res: DSProcedure | null) => {
        if (res === null) {
            return NEVER;
        }
        return wifProcedureService.saveOrCreate(res);
    }),
    tap((res: WIFRecord<DSProcedure>) => logger.info(JSON.stringify(res))),

).subscribe();
