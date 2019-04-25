import * as Koa from 'koa';
import * as Router from 'koa-router';
import { taskService } from './collector';
import { configuration, logger } from './util';

const routeOptions: Router.IRouterOptions = {
    prefix: '/api'
}

const router = new Router(routeOptions);

// https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/webhook
router.post(`/ds-webhook-${configuration.dsWebHookKey}`, (ctx: Koa.Context) => {
    const procedureId = ctx.query.procedure_id;
    const dossierId = ctx.query.dossier_id;
    const state = ctx.query.state;
    const updated_at = ctx.query.updated_at;
    taskService.addTask(procedureId, dossierId, state, updated_at).subscribe({
        complete: () => {
            logger.info(`[WEB HOOK] dossier ${procedureId}-${dossierId} added to update`);
            ctx.body = 'success';
            ctx.status = 201;
        },
        error: (err: any) => {
            logger.error(err);
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
    })
});

export { router };

