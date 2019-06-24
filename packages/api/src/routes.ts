import * as Koa from "koa";
import * as Router from "koa-router";
import { concatMap, filter, flatMap, map, mergeMap, tap } from "rxjs/operators";
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
import { dossierSynchroService } from "./scheduler/dossier-synchro.service";
import { DossierItemInfo, syncService } from "./sync";
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
          )
      });
    ctx.status = 200;
    ctx.body = {
      message: "Result will be displayed in console"
    };
  }
);

router.post(
  `/${configuration.apiPrefix}/procedures/:procedureId/sync`,
  async (ctx: Koa.Context) => {
    const procedureId: number = parseInt(ctx.params.procedureId, 10);
    dossierService
      .deleteByProcedureId(procedureId)
      .pipe(
        mergeMap(() => procedureService.all()),
        flatMap((records: ProcedureRecord[]) => records),
        filter((record: ProcedureRecord) => record.ds_key === procedureId),
        mergeMap((record: ProcedureRecord) =>
          syncService.allDossierItemInfos(record)
        ),
        concatMap((x: DossierItemInfo) => {
          return dossierSynchroService.syncDossier(x.procedureId, x.dossierId);
        })
      )
      .subscribe({
        complete: () =>
          logger.info(`[sync procedure] procedure ${procedureId} complete`),
        error: (err: Error) => logger.error(`[sync procedure] error `, err)
      });

    ctx.status = 200;
    ctx.body = {
      message: `launched procedure #${procedureId} synch`
    };
  }
);

export { router };
