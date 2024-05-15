import type { Server } from "http";

import type { Express } from "express";

import { IScoutDbServerOptions } from "./i-scout-db-server-options.js";

export interface IScoutDbServer {
  readonly expressApp: Express;
  readonly httpServer: Server;
  readonly opts: IScoutDbServerOptions;
}
