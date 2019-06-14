import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { configuration } from "./config";
import { router } from "./routes";
import { dossierScheduler } from "./scheduler/dossier.scheduler";
import { taskScheduler } from "./scheduler/task.scheduler";
import { logger } from "./util";

dossierScheduler.start();
taskScheduler.start();

const app = new Koa();

const port = configuration.apiPort;

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", (err, ctx: Koa.Context) => {
  logger.error(`[error] ${ctx.originalUrl} `, err);
});

app.listen(port);
