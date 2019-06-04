import * as cors from '@koa/cors';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { interval } from 'rxjs';
import { configuration } from './config';
import { router } from './routes';
import { syncService } from './sync.service';
import { logger } from './util';

interval(configuration.taskSchedulerPeriod).subscribe(
    () => syncService.handleTaskToComplete()
);

const app = new Koa();

const port = configuration.apiPort;

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx: Koa.Context) => {
    logger.error(`[error] ${ctx.originalUrl} `, err);
});

app.listen(port);
