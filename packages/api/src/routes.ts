import * as Koa from "koa";
import * as Router from "koa-router";
import { flatMap, map, mergeMap, tap } from "rxjs/operators";
import {
  DossierRecord,
  dossierService,
  dsProcedureConfigRepository,
  ProcedureConfig,
  ProcedureRecord,
  procedureService,
  taskService,
} from "./collector";
import { statisticService } from "./collector/service/statistic.service";
import { configuration } from "./config";
import { logger } from "./util";
import { dsConfigs } from "./util/ds-config";

const routeOptions: Router.IRouterOptions = {
  prefix: "/api",
};

const router = new Router(routeOptions);

router.get("/liveness", (ctx, next) => {
  ctx.body = "Alive";
  next();
});

router.get("/readiness", (ctx, next) => {
  ctx.body = "Ready";
  next();
});

// https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/webhook
router.post(`/${configuration.apiPrefix}/webhook`, async (ctx: Koa.Context) => {
  const procedureId = ctx.query.procedure_id;
  const dossierId = ctx.query.dossier_id;
  const state = ctx.query.state;
  const updated_at = ctx.query.updated_at;
  const res = await taskService
    .addTask("add_or_update", procedureId, dossierId, state, updated_at)
    .toPromise();
  ctx.body = res;
  ctx.status = 201;
});

router.get(`/statistics/:group`, async (ctx: Koa.Context) => {
  const groupId = ctx.params.group;
  const res = await statisticService
    .findByGroup({ id: groupId, type: "autorisation" })
    .toPromise();
  ctx.body = {
    result: res || {},
    success: res ? true : false,
  };
  ctx.status = 200;
});

router.get(`/statistics-introduction/:group`, async (ctx: Koa.Context) => {
  const groupId = ctx.params.group;
  const res = await statisticService
    .findByGroup({ id: groupId, type: "introduction" })
    .toPromise();
  ctx.body = {
    result: res || {},
    success: res ? true : false,
  };
  ctx.status = 200;
});

// init ds_configs
router.post(
  `/${configuration.apiPrefix}/ds_configs/init`,
  async (ctx: Koa.Context) => {
    await dsProcedureConfigRepository
      .delete()
      .pipe(
        map(() => dsConfigs),
        flatMap((x: ProcedureConfig[]) => x),
        mergeMap((x: ProcedureConfig) => dsProcedureConfigRepository.add(x), 1),
        tap((res: ProcedureConfig) =>
          logger.info(`ds config ${res.group.label} added`)
        )
      )
      .toPromise();
    ctx.status = 200;
    ctx.message = "ds configs initialized";
  }
);

router.get(
  `/${configuration.apiPrefix}/procedures/check`,
  async (ctx: Koa.Context) => {
    logger.info(`[check procedures] check is starting`);
    procedureService
      .all()
      .pipe(
        flatMap((x: ProcedureRecord[]) => x),
        mergeMap(
          (x: ProcedureRecord) =>
            dossierService.allByMetadataProcedureId(x.ds_data.id),
          (procedure, dossiers) => ({ procedure, dossiers })
        ),
        tap(
          (param: {
            procedure: ProcedureRecord;
            dossiers: DossierRecord[];
          }) => {
            const total_dossier = param.procedure.ds_data.total_dossier;
            const dossiersNb = param.dossiers.length;
            if (total_dossier !== dossiersNb) {
              logger.info(
                `[check procedures] DS#${param.procedure.ds_data.id} has ${total_dossier} dossiers but ${dossiersNb} saved`
              );
            } else {
              logger.info(
                `[check procedures] DS#${param.procedure.ds_data.id} is complete`
              );
            }
          }
        )
      )
      .subscribe({
        complete: () => logger.info(`[check procedures] check is finished`),
        error: (err: Error) =>
          logger.error(
            `[check procedures] error while checking procedures`,
            err
          ),
      });
    ctx.status = 200;
    ctx.body = {
      message: "Result will be displayed in console",
    };
  }
);

export { router };
