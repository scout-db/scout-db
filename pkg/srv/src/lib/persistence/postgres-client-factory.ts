// db.js
import postgres, { Sql } from 'postgres'

export function createPostgresClient(): Sql {
    const dbPw = "Reassign7Uncivil7Excusably7Cadillac7Activist7Ashy7Charcoal-";
    const sql = postgres(`postgres://postgres.skljxbpcaprmyabexuij:${dbPw}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, {
        ssl: { rejectUnauthorized: false },
    });
    return sql;
}
