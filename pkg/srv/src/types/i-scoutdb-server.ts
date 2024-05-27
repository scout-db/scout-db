import type { Server } from "http";

import type { Express } from "express";

import { IScoutDbServerOptions } from "./i-scoutdb-server-options.js";

export interface IScoutDbServer {
  readonly expressApp: Express;
  readonly httpServer: Server;
  readonly opts: IScoutDbServerOptions;
}
