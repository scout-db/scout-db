import { ISharedGlobalState } from "../lib/state/shared-global-state.js";

export interface IScoutDbServerOptions {
  readonly sgs: ISharedGlobalState;
  readonly httpPort: number;
  readonly httpHost: string;
  readonly wwwDir: string;
}
