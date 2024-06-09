import path from "node:path";

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

  const wwwDirRelative = "../../gui/dist/angular-ngrx-material-starter/";
  const wwwDir = path.resolve(__dirname, wwwDirRelative);
  console.log("wwwDir=%s", wwwDir);

  const sqliteDbPathRelative = "../../../scoutdb.test.sqlite3";
  const sqliteDbPath = path.resolve(__dirname, sqliteDbPathRelative);

  const srvOpts: IScoutDbServerOptions = {
    sgs,
    httpPort: 3000,
    httpHost: "127.0.0.1",
    wwwDir,
    sqliteDbPath,
  };

  const srv: IScoutDbServer = await startServer(srvOpts);
  t.is(srv.opts.httpPort, 3000, "httpPort is 3000");
  t.is(srv.opts.wwwDir, wwwDir, "wwwDir is " + wwwDir);
  t.is(srv.opts.sqliteDbPath, sqliteDbPath, "sqliteDbPath is " + sqliteDbPath);
  t.truthy(srv.httpServer, "httpServer is truthy");
  t.truthy(srv.expressApp, "expressApp is truthy");
});
