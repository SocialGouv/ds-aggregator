import { format } from "logform";
import { createLogger, transports } from "winston";
import { configuration } from "../../config";
import { initializeSentry, notifyMessage, notifyException } from "../sentry";

initializeSentry(configuration);
export const captureException = notifyException(configuration);
export const captureMessage = notifyMessage(configuration);

const appendErrorInfo = (info: any, error: Error) => {
  return {
    ...info,
    message: error.message,
    stack: error.stack,
  };
};

const errorStackFormat = format((info: any) => {
  if (info instanceof Error) {
    return appendErrorInfo(info, info);
  }
  const { ...args } = info;
  if (args) {
    for (let i = 0; i++; i < args.length) {
      if (args[i] instanceof Error) {
        return appendErrorInfo(info, args[i]);
      }
    }
  }
  return info;
});

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errorStackFormat(),
  format.printf((info: any) => {
    const { timestamp, level, message, stack, ...args } = info;

    if (stack) {
      return `${timestamp} ${level}: ${message}\n${stack}`;
    } else {
      return `${timestamp} ${level}: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
      }`;
    }
  })
);

const wLogger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: alignedWithColorsAndTime,
      handleExceptions: true,
    }),
  ],
});

const logger = {
  debug: (message: string) => wLogger.debug(message),
  profile: (id: string) => wLogger.profile(id),
  startTimer: () => wLogger.startTimer(),
  error: (message: string, err: Error) => {
    wLogger.error(message, err);
    if (configuration.sentryEnabled) {
      captureMessage(message);
    }
  },
  info: (message: string, ...meta: any[]) => wLogger.info(message, meta),
};

export default logger;
