import type { Tracer } from "@opentelemetry/api";

import { ISharedGlobalState } from "../lib/state/shared-global-state.js";

export interface IScoutDbServerOptions {
  readonly sgs: ISharedGlobalState;
  readonly httpPort: number;
  readonly httpHost: string;
  readonly wwwDir: string;
  readonly sqliteDbPath: string;
  readonly fastifyLoggingEnabled: boolean;
  readonly tracer: Tracer;
}
