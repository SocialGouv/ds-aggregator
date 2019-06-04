import * as Koa from 'koa';
import * as Router from 'koa-router';
import { flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { dossierService, dsProcedureConfigRepository, procedureService, taskService } from './collector';
import { statisticService } from './collector/service/statistic.service';
import { configuration } from './config';
import { syncService } from './sync.service';
import { logger } from './util';
import { dsConfigs } from './util/ds-config';

const routeOptions: Router.IRouterOptions = {
    prefix: '/api'
}

const router = new Router(routeOptions);


// https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/webhook
router.post(`/${configuration.apiPrefix}/webhook`, async (ctx: Koa.Context) => {
    const procedureId = ctx.query.procedure_id;
    const dossierId = ctx.query.dossier_id;
    const state = ctx.query.state;
    const updated_at = ctx.query.updated_at;
    const res = await taskService.addTask(procedureId, dossierId, state, updated_at).toPromise();
    ctx.body = res;
    ctx.status = 201;
});

// launch global synchronisation
router.post(`/${configuration.apiPrefix}/sync-all`, (ctx: Koa.Context) => {
    syncService.launchGlobalSynchronisation();
    ctx.status = 200;
    ctx.message = "Global synchonisation launched"
});

// launch global synchronisation
router.post(`/${configuration.apiPrefix}/refresh-stats`, (ctx: Koa.Context) => {
    syncService.launchStatisticsComputation();
    ctx.status = 200;
    ctx.message = "Statistics computation launched"
});

router.get(`/statistics/:group`, async (ctx: Koa.Context) => {
    const groupId = ctx.params.group;
    const res = await statisticService.findByGroupId(groupId).toPromise();
    ctx.body = res;
    ctx.status = 200;
});

// init ds_configs
router.post(`/${configuration.apiPrefix}/ds_configs/init`, async (ctx: Koa.Context) => {
    await dsProcedureConfigRepository.delete().pipe(
        map(() => dsConfigs),
        flatMap(x => x),
        mergeMap((x) => dsProcedureConfigRepository.add(x)),
        tap((res) => logger.info(`ds config ${res.group.label} added`))
    ).toPromise();
    ctx.status = 200;
    ctx.message = ctx.message = "ds configs initialized";
});

// get sum(dossier_total)
router.get(`/${configuration.apiPrefix}/dossiers/check`, async (ctx: Koa.Context) => {
    const res: any[] = [];
    await procedureService.all().pipe(
        flatMap(x => x),
        mergeMap(x => dossierService.allByMetadataProcedureId(x.ds_data.id || '0'),
            (procedure, dossiers) => ({ procedure, dossiers })),
        tap(param => {
            const total_dossier = param.procedure.ds_data.total_dossier;
            const dossiersNb = param.dossiers.length;
            if (total_dossier !== dossiersNb) {
                res.push({
                    nb_dossiers: dossiersNb,
                    procedure: param.procedure.ds_data.id,
                    total_dossier,
                });
            }
        })
    ).toPromise();
    ctx.status = 200;
    ctx.body = res;
});

export { router };

