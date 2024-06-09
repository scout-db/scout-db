import { Knex } from "knex";
import { None } from "ts-results";

export async function up(knex: Readonly<Knex>): Promise<void> {
  await knex.schema.debug(true).alterTable("scout", (table) => {
    table.text("email_1").notNullable().unique().alter();
    return None;
  });
}

export async function down(knex: Readonly<Knex>): Promise<void> {
  await knex.schema.debug(true).alterTable("scout", (table) => {
    table.text("email_1").notNullable().alter(); // Removing unique constraint
    return None;
  });
}

export function getId(): Readonly<string> {
  return "sql-002-migration-alter-table-scout-email-unique";
}
