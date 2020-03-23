import { dossierScheduler } from "./scheduler/dossier.scheduler";
import { taskScheduler } from "./scheduler/task.scheduler";
import { configuration } from "./config";
import { logger } from "./util";
import app from "./server";

dossierScheduler.start();
taskScheduler.start();

const port = configuration.apiPort;
const host = "0.0.0.0";

if (configuration.sentryEnabled) {
  logger.info(`Logging to sentry DSN ${configuration.sentryDSN}`);
  logger.info(`Sentry environment ${configuration.envType}`);
  logger.info(`Sentry release ${configuration.version}`);
}
app.listen(port, host, () => {
  logger.info(
    `Starting ${configuration.envType} server at http://${host}:${port}`
  );
});
