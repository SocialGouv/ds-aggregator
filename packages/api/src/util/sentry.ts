import { resolve } from "path";
import { init, captureMessage, Severity, captureException } from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import { Config } from "../config";

// from https://docs.sentry.io/platforms/node/typescript/
declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

export function initializeSentry(configuration: Config) {
  const { sentryEnabled, sentryDSN, version, envType } = configuration;

  if (!sentryEnabled) {
    return;
  }

  global.__rootdir__ = resolve(__dirname, "..", "..") || process.cwd();

  const packageVersion = version || "";
  const isPreProduction = envType !== "prod";
  const environment = isPreProduction ? "preproduction" : "production";

  init({
    debug: isPreProduction,
    dsn: sentryDSN,
    environment,
    integrations: [new RewriteFrames({ root: global.__rootdir__ })],
    release: packageVersion
  });
}

export const notifyMessage = ({ sentryEnabled }: Config) => (
  message: string
) => {
  if (!sentryEnabled) {
    return;
  }
  captureMessage(message, Severity.Error);
};

export const notifyException = ({ sentryEnabled }: Config) => (
  error: Error
) => {
  if (!sentryEnabled) {
    return;
  }
  captureException(error);
};
