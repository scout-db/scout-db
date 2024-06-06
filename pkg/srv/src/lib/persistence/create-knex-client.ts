import path from "node:path";

import knex from "knex";
import { Ok, Result } from "ts-results";

import { createLogger } from "../logging/create-logger";
import { ISharedGlobalState } from "../state/shared-global-state";

import { createMigrationSource } from "./migrations/knex/knex-migration-source";

export interface IRunDbSchemaMigrationsOptions {
  sgs: Readonly<ISharedGlobalState>;
}

export async function createKnexClient(
  req: Readonly<IRunDbSchemaMigrationsOptions>,
): Promise<Result<knex.Knex, Error>> {
  const log = createLogger({ sgs: req.sgs, level: req.sgs.logLevel });
  log.debug("ENTER createKnexClient()");

  log.debug("Creating migration source ...");
  const migrationSource = await createMigrationSource();
  log.debug("Created migration source OK");

  const dbFilePathRelative = "../../../../../infra/scoutdb.sqlite3";
  log.debug("dbFilePathRelative=%s", dbFilePathRelative);
  log.debug("__dirname=%s", __dirname);

  const dbFilePath = path.resolve(__dirname, dbFilePathRelative);
  log.debug("dbFilePath=%s", dbFilePath);

  const knexConfig = {
    client: "sqlite3",
    connection: {
      filename: dbFilePath,
    },
    useNullAsDefault: true,
    migrations: {
      migrationSource: migrationSource,
    },
  };

  const db = knex(knexConfig);
  log.debug("Created Knex DB client OK. Running migrations...");

  const preMigrationDbVersion = await db.migrate.currentVersion();
  log.debug("Pre-migration DB version: %s", preMigrationDbVersion);

  const migrationResults = await db.migrate.latest();

  const postMigrationDbVersion = await db.migrate.currentVersion();
  log.debug("Post-migration DB version: %s", postMigrationDbVersion);
  log.debug("Knex db migrations finished OK: %o", migrationResults);

  log.debug("EXIT createKnexClient() db.VERSION=%s", db.VERSION);
  return Ok(db);
}
