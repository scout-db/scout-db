import { Knex } from "knex";
import { None } from "ts-results";

export async function up(knex: Readonly<Knex>): Promise<void> {
  await knex.schema.createTable("scout", (table) => {
    table.text("id").primary();
    table.text("first_name").notNullable();
    table.text("last_name").notNullable();
    table.integer("birth_year").notNullable();
    table.text("email_1").notNullable();
    table.text("phone_number_1").notNullable();
    table.text("troop_name").notNullable();
    table.integer("troop_number").notNullable();
    table.text("troop_url").notNullable();
    table.text("country").notNullable();
    table.text("state").notNullable();
    table.text("city").notNullable();
    table.text("rank").notNullable();
    table.text("been_to_jubilee").notNullable();
    table.text("can_set_fire").notNullable();
    table.text("can_carve_wood").notNullable();
    table.text("can_train_others").notNullable();
    table.text("can_make_sausage").notNullable();
    table.text("can_lead_campfire").notNullable();
    table.text("can_first_aid").notNullable();
    table.text("can_cook").notNullable();
    return None;
  });
}

export async function down(knex: Readonly<Knex>): Promise<void> {
  await knex.schema.dropTable("scout");
}

export function getId(): Readonly<string> {
  return "sql-001-migration-create-table-scout";
}
