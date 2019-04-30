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
    "departement": "13",
    "procedures": [
        12858,
        12859
    ]
},
{
    "departement": "35",
    "procedures": [
        17197,
        17198
    ]
},
{
    "departement": "42",
    "procedures": [
        16517,
        16520
    ]
},
{
    "departement": "45",
    "procedures": [
        11959,
        11968
    ]
},
{
    "departement": "54",
    "procedures": [
        15700,
        15705
    ]
},
{
    "departement": "55",
    "procedures": [
        16590,
        16592
    ]
},
{
    "departement": "57",
    "procedures": [
        15749,
        15750
    ]
},
{
    "departement": "67",
    "procedures": [
        15751,
        15752
    ]
},
{
    "departement": "69",
    "procedures": [
        6274,
        6286
    ]
},
{
    "departement": "75",
    "procedures": [
        14131,
        13760
    ]
},
{
    "departement": "76",
    "procedures": [
        13093,
        13094
    ]
},
{
    "departement": "77",
    "procedures": [
        12023,
        12101
    ]
},
{
    "departement": "78",
    "procedures": [
        15275,
        15276
    ]
},
{
    "departement": "88",
    "procedures": [
        15747,
        15748
    ]
},
{
    "departement": "91",
    "procedures": [
        15151,
        15149
    ]
},
{
    "departement": "92",
    "procedures": [
        12828,
        12854
    ]
},
{
    "departement": "93",
    "procedures": [
        16476,
        16478
    ]
},
{
    "departement": "94",
    "procedures": [
        16073,
        16075
    ]
},
{
    "departement": "95",
    "procedures": [
        12332,
        12345
    ]
}]