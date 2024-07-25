import path from "node:path";

import { DiagLogLevel } from "@opentelemetry/api";
import type { Tracer } from "@opentelemetry/api";
import test from "ava";

import { ISharedGlobalState } from "./lib/state/shared-global-state.js";
import { startServer } from "./start-server.js";
import { IScoutDbServerOptions } from "./types/i-scoutdb-server-options.js";

test("startServer()", async (t) => {
  const sgs: ISharedGlobalState = {
    tracingExporterTraceOtlpHttpEndpoint: "http://localhost:4318/v1/traces",
    tracingExporterLogOtlpHttpEndpoint: "http://localhost:4318/v1/logs",
    tracingDiagLogLevel: DiagLogLevel.DEBUG,
    tracingSamplingRatio: 1,
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
    tracer: {} as Tracer,
    sgs,
    httpPort: 3000,
    httpHost: "127.0.0.1",
    wwwDir,
    sqliteDbPath,
    fastifyLoggingEnabled: true,
  };

  const srvOut = await startServer(srvOpts);
  t.true(srvOut.ok, "startServer Result is OK");
  const srv = srvOut.expect("startServer() returned with Error");

  t.is(srv.opts.httpPort, 3000, "httpPort is 3000");
  t.is(srv.opts.wwwDir, wwwDir, "wwwDir is " + wwwDir);
  t.truthy(srv.app, "app is truthy");

  srvOut.expect("srvOut  not present").app.close();
});
