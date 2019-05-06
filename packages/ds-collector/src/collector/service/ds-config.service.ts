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
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "13",
        label: "13 - Bouches du Rhône"
    }
},
{
    "procedures": [
        17197,
        17198
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "35",
        label: "35 - Ille-et-Vilaine"
    }
},
{
    "procedures": [
        16517,
        16520
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "42",
        label: "42 - Loire"
    }
},
{
    "procedures": [
        11959,
        11968
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "45",
        label: "45 - Loiret"
    }
},
{
    "procedures": [
        15700,
        15705
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "54",
        label: "54 - Meurthe-et-Moselle"
    }
},
{
    "procedures": [
        16590,
        16592
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "55",
        label: "55 - Meuse"
    }
},
{
    "procedures": [
        15749,
        15750
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "57",
        label: "57 - Moselle"
    }
},
{
    "procedures": [
        15751,
        15752
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "67",
        label: "67 - Bas-Rhin"
    }
},
{
    "procedures": [
        6274,
        6286
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "69",
        label: "69 - Rhône"
    }
},
{
    "procedures": [
        14131,
        13760
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "75",
        label: "75 - Paris"
    }
},
{
    "procedures": [
        13093,
        13094
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "76",
        label: "76 - Seine Maritime"
    }
},
{
    "procedures": [
        12023,
        12101
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "77",
        label: "77 - Seine et marne"
    }
},
{
    "procedures": [
        15275,
        15276
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "78",
        label: "78 - Yvelines"
    }
},
{
    "procedures": [
        15747,
        15748
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "88",
        label: "88 - Vosges"
    }
},
{
    "procedures": [
        15151,
        15149
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "91",
        label: "91 - Essonne"
    }
},
{
    "procedures": [
        12828,
        12854
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "92",
        label: "92 - Hauts de Seine"
    }
},
{
    "procedures": [
        16476,
        16478
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "93",
        label: "93 - Seine-Saint-Denis"
    }
},
{
    "procedures": [
        16073,
        16075
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "94",
        label: "94 - Val de Marne"
    }
},
{
    "procedures": [
        12332,
        12345
    ],
    // tslint:disable-next-line: object-literal-sort-keys
    "group": {
        id: "95",
        label: "95 - Val-d'Oise"
    }
}]