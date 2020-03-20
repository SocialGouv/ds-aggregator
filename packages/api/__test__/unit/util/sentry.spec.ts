//

import * as Sentry from "@sentry/node";

import {
  initializeSentry,
  notifyMessage,
  notifyException
} from "../../../src/util/sentry";
import { Config } from "../../../src/config";
import { resolve } from "path";

//

jest.mock("../../../src/util/logger");

jest.mock("@sentry/node", () => ({
  captureMessage: jest.fn(),
  captureException: jest.fn(),
  init: jest.fn(),
  Severity: { Error: "error" },
  withScope: jest.fn(cb => cb({ setTag: jest.fn() }))
}));

//

const defaultEnv: Partial<Config> = {
  envType: "prod",
  sentryDSN: "https://xxxxxxx@sentry.test.com/n",
  sentryEnabled: true,
  version: "vX.Y.Z"
};

beforeEach(() => {
  (Sentry.captureException as jest.Mock).mockClear();
  (Sentry.captureMessage as jest.Mock).mockClear();
  (Sentry.init as jest.Mock).mockClear();
});

test("should no initialize sentry if not enabled", () => {
  const env: Config = { ...defaultEnv, sentryEnabled: false } as any;

  initializeSentry(env);

  expect(Sentry.init).not.toHaveBeenCalled();
});

test("should initialize sentry in production mode", () => {
  const env: Config = { ...defaultEnv } as any;

  initializeSentry(env);

  expect(Sentry.init).toHaveBeenCalledWith(
    expect.objectContaining({
      debug: false,
      dsn: "https://xxxxxxx@sentry.test.com/n",
      environment: "production",
      release: "vX.Y.Z"
    })
  );

  expect(global.__rootdir__).toBe(resolve(__dirname, "../../.."));
});

test("should initialize sentry in pre-production mode", () => {
  const env: Config = { ...defaultEnv, envType: "dev" } as any;

  initializeSentry(env);

  expect(Sentry.init).toHaveBeenCalledWith(
    expect.objectContaining({
      debug: true,
      dsn: "https://xxxxxxx@sentry.test.com/n",
      environment: "preproduction",
      release: "vX.Y.Z"
    })
  );
});

//

test("should notify message to sentry", () => {
  const env: Config = { ...defaultEnv, envType: "dev" } as any;

  notifyMessage(env)("I'm a teapot");

  expect(Sentry.captureMessage).toHaveBeenCalledWith("I'm a teapot", "error");
});

test("should not notify message to sentry", () => {
  const env: Config = { ...defaultEnv, sentryEnabled: false } as any;

  notifyMessage(env)("I'm a teapot");

  expect(Sentry.captureMessage).not.toHaveBeenCalled();
});

//

test("should notify exception to sentry", () => {
  const env: Config = { ...defaultEnv, envType: "dev" } as any;

  notifyException(env)(new Error("I'm a teapot"));

  expect(Sentry.captureException).toHaveBeenCalledWith(
    new Error("I'm a teapot")
  );
});

test("should not notify exception to sentry", () => {
  const env: Config = { ...defaultEnv, sentryEnabled: false } as any;

  notifyException(env)(new Error("I'm a teapot"));

  expect(Sentry.captureException).not.toHaveBeenCalled();
});
