import bodyParser from "body-parser";
import { Request, Response } from "express";
import express from "express";
import { Ok, Result } from "ts-results";

import {
  createLogger,
  DEFAULT_APP_LOG_LEVEL,
} from "./lib/logging/create-logger.js";
import { IScoutDbServerOptions } from "./types/i-scout-db-server-options.js";
import { IScoutDbServer } from "./types/i-scout-db-server.js";

// Define a regular expression for validating email addresses
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function startServer(
  opts: IScoutDbServerOptions,
): Promise<IScoutDbServer> {
  const logLevel = opts.sgs.logLevel || DEFAULT_APP_LOG_LEVEL;
  const log = createLogger({ sgs: opts.sgs });
  const app = express();

  // Use body-parser to parse JSON requests
  app.use(bodyParser.json());

  // POST handler for receiving email addresses
  app.post(
    "/api/v1/email/sign-up-for-beta",
    async (
      req: Readonly<Request>,
      res: Readonly<Response>,
    ): Promise<Result<unknown, Error>> => {
      const email = req.body.email;

      if (!email) {
        res.status(400).json({ error: "Email address is required" });
      } else if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email address" });
      } else {
        try {
          res.json({ message: "Email address is valid" });
        } catch (ex) {
          console.error(
            "Error saving beta waitlist join. Email: %s:",
            email,
            ex,
          );
        }
      }
      return Ok(null);
    },
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
