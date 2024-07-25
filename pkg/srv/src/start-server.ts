import path from "node:path";

import fastifyHttpProxy from "@fastify/http-proxy";
import fastifyStatic from "@fastify/static";
import { OpenApiJson } from "@kmcssz-org/scoutdb-common";
import Fastify from "fastify";
import { HttpError, InternalServerError } from "http-errors-enhanced-cjs";
import { Err, Ok, Result } from "ts-results";

import {
  createLogger,
  DEFAULT_APP_LOG_LEVEL,
} from "./lib/logging/create-logger.js";
import { IScoutDbServerOptions } from "./types/i-scoutdb-server-options.js";
import { IScoutDbServer } from "./types/i-scoutdb-server.js";

export async function startServer(
  opts: IScoutDbServerOptions,
): Promise<Result<IScoutDbServer, Error>> {
  const logLevel = opts.sgs.logLevel || DEFAULT_APP_LOG_LEVEL;
  const tracer = opts.tracer;
  const log = createLogger({
    sgs: opts.sgs,
    level: logLevel,
    name: "startServer()",
  });
  try {
    const app = Fastify({
      logger: opts.fastifyLoggingEnabled,
    });

    log.debug("Configuring Fastify instance...");

    app.setErrorHandler((err, req, reply): Result<null, Error> => {
      const E_MSG_500_GENERIC =
        "Please take not of the spanId and traceId " +
        "and report it to our team for further investigation of this issue.";

      tracer.startActiveSpan("handleUncaughtErrorFastify", (span) => {
        const { spanId, traceId } = span.spanContext();
        log.error({ err }, "Fastify uncaught HttpError in handler.");
        if (err instanceof HttpError) {
          span.recordException(err);
          const debugData = {
            spanId,
            traceId,
            message: err.error,
            technicalSupport: E_MSG_500_GENERIC,
            ts: new Date().toJSON(),
            url: req.url,
            memoryUsageV8: process.memoryUsage(),
          };
          // Send error response to user
          reply.status(err.statusCode).send(debugData);
        } else {
          // fastify will use parent error handler to handle this
          log.warn({ err }, "Fastify uncaught generic handler Error.");
          reply.send(err);
        }
        span.end();
        return Ok(null);
      });
      return Ok(null);
    });

    const paths = Object.keys(
      (OpenApiJson as { paths: Record<string, unknown> }).paths,
    );
    log.debug(`Paths to be checked by OpenApiValidator: `, paths);

    app.post(
      "/api/v1/health",
      async (req): Promise<Record<string, unknown>> => {
        const fn = "HTTP POST /api/v1/health";
        log.debug("%s ENTRY", fn);

        return {
          ts: new Date().toJSON(),
          url: req.url,
          memoryUsageV8: process.memoryUsage(),
        };
      },
    );

    app.get("/api/hello", async (req): Promise<Record<string, unknown>> => {
      log.info("HTTP GET /api/hello");
      return {
        message: "hello",
        url: req.url,
        requestIp: req.ip,
        requestedAt: new Date(),
      };
    });

    app.get("/api/simulate-error-throw", async (req): Promise<void> => {
      log.info("HTTP GET /api/simulate-error-throw");
      throw new InternalServerError("We threw it!" + JSON.stringify(req.query));
    });

    app.get("/api/simulate-error-log", async (req): Promise<void> => {
      log.info("HTTP GET /api/simulate-error-log");

      const causeRoot = new Error("The laws of physics.");
      const cause = new Error("CAP Theorem.", { cause: causeRoot });

      const errorMessage = "We logged it!" + JSON.stringify(req.query);
      const ex = new TypeError(errorMessage, { cause });
      log.error(ex, "VERSION_1 Simulated error logged.");
      log.error({ ex }, "VERSION_2 Simulated error logged.");
      log.error({ err: ex }, "VERSION_3 Simulated error logged.");
    });

    app.setNotFoundHandler(async (_req, reply) => {
      const indexHtmlPath = path.join(opts.wwwDir, "index.html");
      return reply.sendFile(indexHtmlPath);
    });

    app.register(fastifyStatic, {
      root: opts.wwwDir,
      logLevel: "debug",
    });

    app.register(fastifyHttpProxy, {
      upstream: "http://fixme.my-api.example.com",
      prefix: "/api", // optional
      http2: true, // optional
    });

    log.debug("Registered Fastify handlers OK.");
    log.debug("Effective log level=%s", logLevel);

    // Start the server
    const { httpHost, httpPort } = opts;

    const address = await app.listen({ port: httpPort, host: httpHost });
    log.info(`Fastify listening address: ${address}`);
    log.info(`Server is running on HTTP host ${httpHost}`);
    log.info(`Server is running on HTTP port ${httpPort}`);
    log.info(`Serving static files from ${opts.wwwDir}`);
    log.debug("Instantiated HTTP server OK");

    const output: IScoutDbServer = {
      app: app,
      opts,
    };
    return Ok(output);
  } catch (ex: unknown) {
    const errorMessage = "Failed to start/configure Fastify server.";
    const err = new InternalServerError(errorMessage, { cause: ex });
    log.error({ err });
    return Err(err);
  }
}
