import path from "path";

import { newRex, OpenApiJson, Scout } from "@kmcssz-org/scoutdb-common";
import bodyParser from "body-parser";
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  OK,
} from "http-errors-enhanced-cjs";
import { Err, Ok, Result } from "ts-results";

import {
  createLogger,
  DEFAULT_APP_LOG_LEVEL,
} from "./lib/logging/create-logger.js";
import { checkScoutEmailExists } from "./lib/persistence/check-scout-email-exists.js";
import { createKnexClient } from "./lib/persistence/create-knex-client.js";
import { IScoutDbServerOptions } from "./types/i-scoutdb-server-options.js";
import { IScoutDbServer } from "./types/i-scoutdb-server.js";

export async function startServer(
  opts: IScoutDbServerOptions,
): Promise<IScoutDbServer> {
  const logLevel = opts.sgs.logLevel || DEFAULT_APP_LOG_LEVEL;
  const log = createLogger({ sgs: opts.sgs, level: logLevel });
  const app = express();
  const db = (
    await createKnexClient({ sgs: opts.sgs, sqliteDbPath: opts.sqliteDbPath })
  ).expect("The Knex client to have been created OK.");

  log.debug("Configuring ExpressJS instance...");
  // Use body-parser to parse JSON requests
  app.use(bodyParser.json());
  log.debug("Enabled HTTP request JSON body parser OK");

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

  // GET handler for fetching paginated scout records
  app.get(
    OpenApiJson.paths["/api/v1/scouts"].get["x-kmcssz"].httpPath,
    async (req, res): Promise<Result<void, Error>> => {
      const fn = "HTTP GET /api/v1/scouts";
      log.debug("%s ENTRY", fn);

      if (typeof req.query.page !== "string") {
        res
          .status(BAD_REQUEST)
          .json({ error: "Invalid page query parameter." });
        return Ok.EMPTY;
      }
      if (typeof req.query.pageSize !== "string") {
        res
          .status(BAD_REQUEST)
          .json({ error: "Invalid pageSize query parameter." });
        return Ok.EMPTY;
      }

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      log.debug("%s page=%d pageSize=%d offset=%d", fn, page, pageSize, offset);

      try {
        // Get the total count of records
        const totalRecordsResult = await db("scout")
          .count("* as count")
          .first();
        if (!totalRecordsResult) {
          throw new Error("Could not count scout rows.");
        }
        log.debug("%s totalRecordResult=%o", fn, totalRecordsResult);

        const totalRowCount =
          typeof totalRecordsResult.count === "string"
            ? parseInt(totalRecordsResult.count, 10)
            : totalRecordsResult.count;

        log.debug("%s totalRowCount=%d", fn, totalRowCount);

        const totalPages = Math.ceil(totalRowCount / pageSize);
        log.debug("%s totalPages=%d", fn, totalPages);

        // Get the paginated data
        const scouts = await db("scout")
          .select("*")
          .limit(pageSize)
          .offset(offset);

        res.status(OK).json({
          data: scouts,
          pagination: {
            totalRecords: totalRowCount,
            totalPages: totalPages,
            currentPage: page,
            pageSize: pageSize,
          },
        });
        return Ok.EMPTY;
      } catch (ex: unknown) {
        const rex = newRex("Failed to serve request: ", ex);
        res.status(INTERNAL_SERVER_ERROR).json({ error: rex.toJSON() });
        return Err(rex);
      }
    },
  );

  app.get("/api/v1/scouts", async (req, res): Promise<Result<void, Error>> => {
    const fn = "HTTP GET /api/v1/scouts";
    log.debug("%s ENTRY", fn);

    try {
      const entity = await db<Scout>("scout").insert(req.body);
      log.debug("[knex] scout entity: %o", entity);
      res.json({
        entity,
        ts: new Date().toJSON(),
        url: req.url,
      });
    } catch (ex: unknown) {
      const rex = newRex("Failed to insert scout entity to SQLite.", ex);
      log.debug(rex);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "InternalServerError",
      });
    }
    return Ok.EMPTY;
  });

  app.post("/api/v1/scouts", async (req, res): Promise<Result<void, Error>> => {
    const fn = "HTTP POST /api/v1/scouts";
    log.debug("%s ENTRY", fn);

    const scout = req.body as Scout;
    const { sgs } = opts;
    const { email_1: email } = scout;

    const emailCheck = await checkScoutEmailExists({ sgs, db, email });
    if (emailCheck.err) {
      res.status(emailCheck.val.statusCode);

      if (emailCheck.val.isServerError) {
        log.error("%s Check fail: scout email uniqueness %o", emailCheck.val);
      } else {
        log.debug("%s Scout email is not unique: %o", scout.email_1);
        const errPojo = emailCheck.val.serialize();
        res.json(errPojo);
      }
      return Ok.EMPTY;
    }

    try {
      const entity = await db<Scout>("scout").insert(req.body);
      log.debug("[knex] scout entity: %o", entity);
      res.json({
        entity,
        ts: new Date().toJSON(),
        url: req.url,
      });
    } catch (ex: unknown) {
      const rex = newRex("Failed to insert scout entity to SQLite.", ex);
      log.debug(rex);
      res.status(INTERNAL_SERVER_ERROR).json({
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

  log.debug("Registered ExpressJS handlers OK.");

  // Start the server
  const { httpHost, httpPort } = opts;
  const httpServer = app.listen(httpPort, httpHost, (): unknown => {
    log.debug("Effective log level=%s", logLevel);
    log.info(`Server is running on HTTP host ${httpHost}`);
    log.info(`Server is running on HTTP port ${httpPort}`);
    log.info(`Serving static files from ${opts.wwwDir}`);
    return;
  });
  log.debug("Instantiated HTTP server OK");

  return {
    httpServer,
    expressApp: app,
    opts,
  };
}
