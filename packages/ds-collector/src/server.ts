import { NEVER } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { demarcheSimplifieeAPI, DSProcedure } from "./demarche-simplifiee";
import { logger } from "./util";
import { wifProcedureService } from "./work-in-france/service";
import { WIFRecord } from "./work-in-france/model";

demarcheSimplifieeAPI.getDSProcedure(9407).pipe(
    // tap((res: DSProcedure | null) => logger.info(JSON.stringify(res))),
    switchMap((res: DSProcedure | null) => {
        if (res === null) {
            return NEVER;
        }
        return wifProcedureService.saveOrCreate(res);
    }),
    tap((res: WIFRecord<DSProcedure> | null) => logger.info(JSON.stringify(res))),

).subscribe();

wifProcedureService.all().subscribe((res) => logger.info('LIST: ' + JSON.stringify(res, undefined, 2)))
