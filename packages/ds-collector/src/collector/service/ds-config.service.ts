import { Observable } from "rxjs";
import { filter, flatMap, switchMap, tap } from "rxjs/operators";
import { logger } from "../../util";
import { ProcedureConfig } from "../model";
import { dsProcedureConfigRepository } from "../repository";

class DSProcedureConfigService {

    public all(): Observable<ProcedureConfig[]> {
        return dsProcedureConfigRepository.all();
    }

    public init(): void {
        this.all().pipe(
            tap((res) => logger.info(`[DSProcedureConfigService.init] ds-configs size ${res.length}`)),
            filter((res) => res.length === 0),
            tap(() => logger.info(`[DSProcedureConfigService.init] init ds-configs for DEVELOPMENT`)),
            flatMap(() => devConfigs),
            switchMap((config) => dsProcedureConfigRepository.add(config))
        ).subscribe({
            error: (error: any) => {
                logger.error("[DSProcedureConfigService.init]", error);
            }
        });
    }
}

export const dsProcedureConfigService = new DSProcedureConfigService();


const devConfigs: ProcedureConfig[] = [{
    "procedures": [
        12858,
        12859
    ],
    "structure": "13"
},
{
    "procedures": [
        17197,
        17198
    ],
    "structure": "35"
},
{
    "procedures": [
        16517,
        16520
    ],
    "structure": "42"
},
{
    "procedures": [
        11959,
        11968
    ],
    "structure": "45"
},
{
    "procedures": [
        15700,
        15705
    ],
    "structure": "54"
},
{
    "procedures": [
        16590,
        16592
    ],
    "structure": "55"
},
{
    "procedures": [
        15749,
        15750
    ],
    "structure": "57"
},
{
    "procedures": [
        15751,
        15752
    ],
    "structure": "67"
},
{
    "procedures": [
        6274,
        6286
    ],
    "structure": "69"
},
{
    "procedures": [
        14131,
        13760
    ],
    "structure": "75"
},
{
    "procedures": [
        13093,
        13094
    ],
    "structure": "76"
},
{
    "procedures": [
        12023,
        12101
    ],
    "structure": "77"
},
{
    "procedures": [
        15275,
        15276
    ],
    "structure": "78"
},
{
    "procedures": [
        15747,
        15748
    ],
    "structure": "88"
},
{
    "procedures": [
        15151,
        15149
    ],
    "structure": "91"
},
{
    "procedures": [
        12828,
        12854
    ],
    "structure": "92"
},
{
    "procedures": [
        16476,
        16478
    ],
    "structure": "93"
},
{
    "procedures": [
        16073,
        16075
    ],
    "structure": "94"
},
{
    "procedures": [
        12332,
        12345
    ],
    "structure": "95"
}]