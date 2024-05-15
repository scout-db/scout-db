import { Row, RowList, Sql } from "postgres";
import { Err, Ok, Result } from "ts-results";


export interface ISaveJoinerEmailAddressOptions {
  readonly emailAddress: string;
  readonly db: Sql;
}

export async function saveJoinerEmailAddress(
  opts: Readonly<ISaveJoinerEmailAddressOptions>,
): Promise<Result<RowList<Row[]>, Error>> {
  if (!opts.emailAddress) {
    return Err(new Error("No email address provided"));
  }
  const waitlist_members = await opts.db`
    insert into beta_waitlist
      (email_address)
    values
      (${ opts.emailAddress })
    returning id, created_at, email_address
  `;

  return Ok(waitlist_members);
}
