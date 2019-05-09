import * as Koa from 'koa';
import * as Router from 'koa-router';
import { taskService } from './collector';
import { statisticService } from './collector/service/statistic.service';
import { configuration } from './config';
import { syncService } from './sync.service';
import { logger } from './util';

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
    await taskService.addTask(procedureId, dossierId, state, updated_at).toPromise().then(() => {
        logger.info(`[WEB HOOK] dossier ${procedureId}-${dossierId} added to update`);
        ctx.body = 'success';
        ctx.status = 201;
    });
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
    await statisticService.findByGroupId(groupId).toPromise().then((res) => {
        ctx.body = {
            "success": true,
            // tslint:disable-next-line: object-literal-sort-keys
            "result": res
        };
        ctx.status = 200;
    })
});

export { router };

