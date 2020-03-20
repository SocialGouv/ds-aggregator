import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { configuration } from "./config";
import { router } from "./routes";
import { dossierScheduler } from "./scheduler/dossier.scheduler";
import { taskScheduler } from "./scheduler/task.scheduler";
import { logger } from "./util";
import { captureException } from "./util/logger/logger";

dossierScheduler.start();
taskScheduler.start();

const app = new Koa();

const port = configuration.apiPort;

if (configuration.sentryEnabled) {
  logger.info(`Logging to sentry DSN ${configuration.sentryDSN}`);
  logger.info(`Sentry environment ${configuration.envType}`);
  logger.info(`Sentry release ${configuration.version}`);
}

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", (err, ctx: Koa.Context) => {
  logger.error(`[error] ${ctx.originalUrl} `, err);
  captureException(err);
});

app.listen(port);

logger.info(`server is started!`);
