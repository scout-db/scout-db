import { DiagLogLevel } from "@opentelemetry/api";
import test from "ava";

import { ISharedGlobalState } from "./lib/state/shared-global-state.js";
import { startServer } from "./start-server.js";
import { IScoutDbServerOptions } from "./types/i-scoutdb-server-options.js";
import { IScoutDbServer } from "./types/i-scoutdb-server.js";

test("startServer()", async (t) => {
  const sgs: ISharedGlobalState = {
    tracingExporterTraceOtlpHttpEndpoint: "http://localhost:4318/v1/traces",
    tracingDiagLogLevel: DiagLogLevel.DEBUG,
    buildVersion: "0.0.0-test",
    extras: new Map(),
    logLevel: "trace",
    serviceName: "scoutdb-server-TEST",
    serviceVersion: "0.0.0-test",
  };
  const srvOpts: IScoutDbServerOptions = {
    sgs,
    httpPort: 3000,
    httpHost: "localhost",
    wwwDir: "./public",
    sqliteDbPath: "../../"
  };

  const srv: IScoutDbServer = await startServer(srvOpts);
  t.is(srv.opts.httpPort, 3000, "httpPort is 3000");
  t.is(srv.opts.wwwDir, "./public", "wwwDir is ./public");
  t.truthy(srv.httpServer, "httpServer is truthy");
  t.truthy(srv.expressApp, "expressApp is truthy");
});
