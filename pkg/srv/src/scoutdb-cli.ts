import process from "node:process";

import yargs from "yargs";

import { ISharedGlobalState } from "./lib/state/shared-global-state.js";
import { configureOpenTelemetry } from "./lib/tracing/configure-open-telemetry.js";
import { isAppLogLevel } from "./types/app-log-level.js";
import type { IScoutDbServerOptions } from "./types/i-scoutdb-server-options.js";
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
    .option("sqlite-db-path", {
      alias: "d",
      type: "string",
      default: "/data/scoutdb/scoutdb.sqlite3",
      description: "File path of the SQL db (SQLite) file to use.",
    })
    .option("tracing-exporter-trace-otlp-http-endpoint", {
      type: "string",
      default: "http://localhost:4318/v1/traces",
      description: "OTLP traces endpoint to use by the HTTP trace exporter",
    })
    .option("tracing-exporter-log-otlp-http-endpoint", {
      type: "string",
      default: "http://localhost:4318/v1/logs",
      description: "OTLP logs endpoint to use by the HTTP log exporter",
    })
    .option("tracing-instrumentation-fs-enabled", {
      alias: "fle",
      type: "boolean",
      default: false,
      boolean: true,
      defaultDescription: "It is off  by default.",
      description:
        "Enables automatic instrumentation of NodeJS file-system operations. " +
        "It can cause memory usage spikes during application boot when the " +
        "source code for dependencies is read from the file-system.",
    })
    .option("tracing-sampling-ratio", {
      type: "number",
      default: 1,
      description:
        "For example 1 will lead to sampling everything (100%) and " +
        "0.1 will result in 10% of the traces sampled. " +
        "See: https://opentelemetry.io/docs/languages/js/sampling/#traceidratiobasedsampler",
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
      default: "scoutdb-server",
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
    .option("fastify-logging-enabled", {
      alias: "fle",
      type: "boolean",
      default: false,
      boolean: true,
      defaultDescription: "It is off  by default.",
      description:
        "Enables Fastify request logging. " +
        "See: https://fastify.dev/docs/latest/Reference/Logging/#enable-logging",
    })
    .env("SCOUTDB")
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
    tracingExporterLogOtlpHttpEndpoint: argv.tracingExporterLogOtlpHttpEndpoint,
    tracingDiagLogLevel: diagLogLevel,
    tracingSamplingRatio: argv.tracingSamplingRatio,
    logLevel: argv.logLevel,
    serviceName: argv.tracingServiceName,
    serviceVersion: "0.0.0-test", // FIXME - parse this from package.json
    buildVersion: "0.0.0-test", // FIXME - parse this from package.json
    extras: new Map(),
  };

  const { tracer } = await configureOpenTelemetry({
    sgs,
    enableInstrumentationFs: false,
  });

  const { createLogger } = await import("./lib/logging/create-logger.js");

  const log = createLogger({
    sgs: sgs,
    level: sgs.logLevel,
    name: "daffodil-cli",
  });

  log.info("Importing start-server impl...");
  const { startServer } = await import("./start-server.js");

  log.info("Launching server...");

  const srvOpts: IScoutDbServerOptions = {
    tracer,
    sgs,
    httpPort: argv.httpPort,
    httpHost: argv.httpHost,
    wwwDir: argv.wwwDir,
    sqliteDbPath: argv.sqliteDbPath,
    fastifyLoggingEnabled: argv.fastifyLoggingEnabled,
  };
  const startResult = await startServer(srvOpts);

  if (startResult.err) {
    const errorMessage = "Failed to start Daffodil Server.";
    log.fatal({ err: startResult.val }, errorMessage);
    process.exit(1);
  } else {
    log.info("Launched server OK");
  }
}

if (require.main === module) {
  main().catch((ex) => {
    console.error("Fatal Error in Application: ", ex);
    process.exit(1);
  });
}
