import path from "path";

import { OpenApiJson, Scout } from "@kmcssz-org/scoutdb-common";
import bodyParser from "body-parser";
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { Knex, knex } from "knex";
import { Ok, Result } from "ts-results";

import {
  createLogger,
  DEFAULT_APP_LOG_LEVEL,
} from "./lib/logging/create-logger.js";
import { IScoutDbServerOptions } from "./types/i-scoutdb-server-options.js";
import { IScoutDbServer } from "./types/i-scoutdb-server.js";

export async function startServer(
  opts: IScoutDbServerOptions,
): Promise<IScoutDbServer> {
  const logLevel = opts.sgs.logLevel || DEFAULT_APP_LOG_LEVEL;
  const log = createLogger({ sgs: opts.sgs });
  const app = express();

  // Use body-parser to parse JSON requests
  app.use(bodyParser.json());

  const paths = Object.keys(
    (OpenApiJson as { paths: Record<string, unknown> }).paths,
  );
  log.debug(`Paths to be checked by OpenApiValidator: `, paths);

  app.use(
    OpenApiValidator.middleware({
      apiSpec: OpenApiJson as never,
      validateApiSpec: false,
      validateRequests: true, // (default)
      validateResponses: false, // false by default
      ignorePaths: (path: string) => !paths.includes(path),
    }),
  );

  app.post("/api/v1/health", async (req, res): Promise<Result<void, Error>> => {
    const fn = "HTTP POST /api/v1/health";
    log.debug("%s ENTRY", fn);

    res.json({
      ts: new Date().toJSON(),
      url: req.url,
      memoryUsageV8: process.memoryUsage(),
    });
    return Ok.EMPTY;
  });

  app.post("/api/v1/scouts", async (req, res): Promise<Result<void, Error>> => {
    const fn = "HTTP POST /api/v1/scouts";
    log.debug("%s ENTRY", fn);

    const config: Knex.Config = {
      client: "sqlite3",
      connection: {
        filename: "../../infra/scoutdb.db",
      },
    };

    const knexInstance = knex(config);
    log.debug("knexInstance created OK: ", knexInstance.VERSION);

    try {
      const entity = await knexInstance<Scout>("scout").insert(req.body);
      log.debug("[knex] scout entity: %o", entity);
      res.json({
        entity,
        ts: new Date().toJSON(),
        url: req.url,
      });
    } catch (ex: unknown) {
      log.error("Failed to insert scout record: ", ex);
      res.status(500).json({
        message: "InternalServerError",
      });
    }
    return Ok.EMPTY;
  });

  // Define an API endpoint
  app.get("/api/hello", (req, res): Result<void, Error> => {
    log.info("HTTP GET /api/hello");
    res.json({
      message: "hello",
      url: req.url,
      requestIp: req.ip,
      requestedAt: new Date(),
    });
    return Ok.EMPTY;
  });

  // Serve static files
  app.use(express.static(opts.wwwDir));

  app.get("*", (_req, res): Result<void, Error> => {
    res.sendFile(path.join(opts.wwwDir, "index.html"));
    return Ok.EMPTY;
  });

  // Start the server
  const { httpHost, httpPort } = opts;
  const httpServer = app.listen(httpPort, httpHost, (): unknown => {
    log.debug("Effective log level=%s", logLevel);
    log.info(`Server is running on HTTP host ${httpHost}`);
    log.info(`Server is running on HTTP port ${httpPort}`);
    log.info(`Serving static files from ${opts.wwwDir}`);
    return;
  });

  return {
    httpServer,
    expressApp: app,
    opts,
  };
}
