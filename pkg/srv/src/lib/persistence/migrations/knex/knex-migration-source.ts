import { Knex } from "knex";
import { Err, Ok, Result } from "ts-results";

import * as Sql001MigrationCreateTableScout from "./sql-001-migration_create_table_scout";
import * as Sql002MigrationAlterTableScoutEmailUnique from "./sql-002-migration_alter_table_scout_email_unique";

export interface IKnexMigration {
  up(knex: Readonly<Knex>): Promise<void>;
  down(knex: Readonly<Knex>): Promise<void>;
  getId(): Readonly<string>;
}

export interface IKnexMigrationSource<T> {
  getMigrations(): Promise<string[]>;

  getMigrationName(migrationName: Readonly<string>): string;

  getMigration(migrationName: string): Promise<T>;
}

function registerMigration(
  // eslint-disable-next-line functional/prefer-immutable-types
  migrations: Map<string, IKnexMigration>,
  aMigration: IKnexMigration,
): Result<void, Error> {
  const id = aMigration.getId();
  if (migrations.has(id)) {
    return Err(new Error("Duplicate migration ID detected: " + id));
  } else {
    migrations.set(id, aMigration);
  }
  return Ok.EMPTY;
}

export function createMigrationSource(): IKnexMigrationSource<IKnexMigration> {
  const migrations: Map<string, IKnexMigration> = new Map();

  registerMigration(migrations, Sql001MigrationCreateTableScout);
  registerMigration(migrations, Sql002MigrationAlterTableScoutEmailUnique);

  const kms: IKnexMigrationSource<IKnexMigration> = {
    getMigrations: async (): Promise<string[]> => {
      return Array.from(migrations.keys());
    },
    getMigrationName: (migrationName: Readonly<string>): Readonly<string> => {
      return migrationName;
    },
    getMigration: async function (
      migrationName: string,
    ): Promise<IKnexMigration> {
      const aMigration = migrations.get(migrationName);
      if (!aMigration) {
        throw new Error("No such migration present: " + migrationName);
      }
      return aMigration;
    },
  };
  return kms;
}
