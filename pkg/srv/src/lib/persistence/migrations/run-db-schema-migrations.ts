import { Ok, Result } from "ts-results";

import { createLogger } from "../../logging/create-logger";
import { ISharedGlobalState } from "../../state/shared-global-state";

export interface IRunDbSchemaMigrationsOptions {
  sgs: Readonly<ISharedGlobalState>;
}

export async function runDbSchemaMigrations(
  req: Readonly<IRunDbSchemaMigrationsOptions>,
): Promise<Result<void, Error>> {
  const log = createLogger({ sgs: req.sgs, level: req.sgs.logLevel });
  log.debug("ENTER runDbSchemaMigrations()");

  log.debug("EXIT runDbSchemaMigrations()");
  return Ok.EMPTY;
}
