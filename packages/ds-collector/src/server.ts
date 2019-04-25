import * as cors from '@koa/cors';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { router } from './routes';
import { syncService } from './sync.service';
import { configuration } from './util';

syncService.startHandleTaskToComplete(configuration.taskSchedulerPeriod);
syncService.syncAll();

const app = new Koa();

const port = configuration.apiPort;

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);
