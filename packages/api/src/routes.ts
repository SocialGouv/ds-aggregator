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
  taskService
} from "./collector";
import { statisticService } from "./collector/service/statistic.service";
import { configuration } from "./config";
import { logger } from "./util";
import { dsConfigs } from "./util/ds-config";

const routeOptions: Router.IRouterOptions = {
  prefix: "/api"
};

const router = new Router(routeOptions);

// https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/webhook
router.post(`/${configuration.apiPrefix}/webhook`, async (ctx: Koa.Context) => {
  const procedureId = ctx.query.procedure_id;
  const dossierId = ctx.query.dossier_id;
  const state = ctx.query.state;
  const updated_at = ctx.query.updated_at;
  const res = await taskService
    .addTask(procedureId, dossierId, state, updated_at)
    .toPromise();
  ctx.body = res;
  ctx.status = 201;
});

router.get(`/statistics/:group`, async (ctx: Koa.Context) => {
  const groupId = ctx.params.group;
  const res = await statisticService.findByGroupId(groupId).toPromise();
  ctx.body = res;
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
        mergeMap((x: ProcedureConfig) => dsProcedureConfigRepository.add(x)),
        tap((res: ProcedureConfig) =>
          logger.info(`ds config ${res.group.label} added`)
        )
      )
      .toPromise();
    ctx.status = 200;
    ctx.message = "ds configs initialized";
  }
);

// get sum(dossier_total)
router.get(
  `/${configuration.apiPrefix}/dossiers/check`,
  async (ctx: Koa.Context) => {
    procedureService.all().pipe(
      flatMap((x: ProcedureRecord[]) => x),
      mergeMap(
        (x: ProcedureRecord) =>
          dossierService.allByMetadataProcedureId(x.ds_data.id || "0"),
        (procedure, dossiers) => ({ procedure, dossiers })
      ),
      tap(
        (param: { procedure: ProcedureRecord; dossiers: DossierRecord[] }) => {
          const total_dossier = param.procedure.ds_data.total_dossier;
          const dossiersNb = param.dossiers.length;
          if (total_dossier !== dossiersNb) {
            logger.info(
              `[Check Result] DS#${param.procedure.ds_data.id} with ${total_dossier} dossiers: ${dossiersNb} saved`
            );
          }
        }
      )
    );
    ctx.status = 200;
    ctx.body = {
      message: "Result will be displayed in console"
    };
  }
);

export { router };
