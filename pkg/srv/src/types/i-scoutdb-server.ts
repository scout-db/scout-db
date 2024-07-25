import { FastifyInstance } from "fastify";

import { IScoutDbServerOptions } from "./i-scoutdb-server-options.js";

export interface IScoutDbServer {
  readonly app: FastifyInstance;
  readonly opts: IScoutDbServerOptions;
}
