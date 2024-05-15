import process from "process";

import yargs from "yargs";

import { newRex } from "../../common/build/main/index.js";

import { ISharedGlobalState } from "./lib/state/shared-global-state.js";
import { configureOpenTelemetry } from "./lib/tracing/configure-open-telemetry.js";
import { isAppLogLevel } from "./types/app-log-level.js";
import type { IScoutDbServerOptions } from "./types/i-scout-db-server-options.js";
import { diagLogLevelFromString } from "./types/open-telemetry/diag-log-level-converters.js";

export async function main() {
  const argv = await yargs(process.argv.slice(2))
    .option("http-host", {
      type: "string",
      default: "localhost",
      description: "HTTP host for the web server to listen on",
    })
    .option("http-port", {
      type: "number",
      default: 3000,
      description: "Port for the HTTP web server",
    })
    .option("www-dir", {
      alias: "w",
      type: "string",
      default: "./public",
      description: "Directory containing static files",
    })
    .option("tracing-exporter-trace-otlp-http-endpoint", {
      type: "string",
      default: "http://localhost:4318/v1/traces",
      description: "OTLP traces endpoint to use by the HTTP trace exporter",
    })
    .option("tracing-diag-log-level", {
      type: "string",
      choices: ["NONE", "ERROR", "WARN", "INFO", "DEBUG", "VERBOSE", "ALL"],
      default: "INFO",
      description:
        "Sets the internal diagnostic log level of the tracer. " +
        "Note: this is NOT the applications own logs. " +
        "See the OpenTelemetry JS projects sources for the " +
        "definitions of the enum called 'DiagLogLevel'. At the time of this" +
        "writing they went like this: NONE = 0, ERROR = 30, WARN = 50, " +
        "INFO = 60, DEBUG = 70, VERBOSE = 80, ALL = 9999",
    })
    .option("tracing-service-name", {
      alias: "tsn",
      type: "string",
      default: "scout-db-server",
      description: "The service name to use for tracing and logging.",
    })
    .option("log-level", {
      alias: "l",
      type: "string",
      choices: ["silent", "fatal", "error", "warn", "info", "debug", "trace"],
      default: "info",
      description:
        "Logging level (one of: silent, fatal, error, warn, info, debug, trace)",
    })
    .env("SCOUT_DB")
    .help()
    .alias("help", "h").argv;

  if (!isAppLogLevel(argv.logLevel)) {
    throw new Error(`argv.logLevel=${argv.logLevel} not a valid log level`);
  }

  const diagLogLevel = diagLogLevelFromString(argv.tracingDiagLogLevel).expect(
    "Failed to parse tracingDiagLogLevel correctly.",
  );

  const sgs: ISharedGlobalState = {
    tracingExporterTraceOtlpHttpEndpoint:
      argv.tracingExporterTraceOtlpHttpEndpoint,
    tracingDiagLogLevel: diagLogLevel,
    logLevel: argv.logLevel,
    serviceName: argv.tracingServiceName,
    serviceVersion: "0.0.0-test",
    buildVersion: "0.0.0-test",
    extras: new Map(),
  };

  const srvOpts: IScoutDbServerOptions = {
    sgs,
    httpPort: argv.httpPort,
    httpHost: argv.httpHost,
    wwwDir: argv.wwwDir,
  };

  try {
    await configureOpenTelemetry({ sgs });
  } catch (ex: unknown) {
    throw newRex("Failed to configure OpenTelemetry", ex);
  }

  const { startServer } = await import("./start-server.js");
  await startServer(srvOpts);
}

if (require.main === module) {
  main();
  // .catch((err) => {
  //   console.error(err);
  //   process.exit(1);
  // });
}
