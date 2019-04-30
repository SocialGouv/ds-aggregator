import * as cors from '@koa/cors';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { dsProcedureConfigService } from './collector';
import { statisticService } from './collector/service/statistic.service';
import { router } from './routes';
import { syncService } from './sync.service';
import { configuration } from './util';

if (process.env.NODE_ENV !== 'development') {
    dsProcedureConfigService.init();
}

syncService.startHandleTaskToComplete(configuration.taskSchedulerPeriod);
// syncService.syncAll();
statisticService.statistic();

const app = new Koa();

const port = configuration.apiPort;

app.use(bodyParser());
app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);
