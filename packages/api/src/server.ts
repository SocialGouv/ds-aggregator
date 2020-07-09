import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { router } from "./routes";
import { logger } from "./util";
import { captureException } from "./util/logger/logger";
import dbConnect from "./collector/database/config";

const app = new Koa();

dbConnect();

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", (err, ctx: Koa.Context) => {
  logger.error(`[error] ${ctx.originalUrl}`, err);
  captureException(err);
});

export default app;
