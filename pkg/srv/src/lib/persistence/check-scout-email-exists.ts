import { Scout } from "@kmcssz-org/scoutdb-common";
import { BadRequestError, HttpError } from "http-errors-enhanced-cjs";
import { InternalServerError } from "http-errors-enhanced-cjs";
import { Knex } from "knex";
import { Err, Ok, Result } from "ts-results";

import { hasKey } from "../../types/has-key";
import { createLogger } from "../logging/create-logger";
import { ISharedGlobalState } from "../state/shared-global-state";

export interface ICheckScoutEmailExistsReq {
  readonly sgs: ISharedGlobalState;
  readonly db: Knex;
  readonly email: string;
}

export async function checkScoutEmailExists(
  req: ICheckScoutEmailExistsReq,
): Promise<Result<void, HttpError>> {
  const log = createLogger({
    sgs: req.sgs,
    level: req.sgs.logLevel,
    name: "checkScoutEmailExists()",
  });

  const aRow = await req
    .db<Scout>("scout")
    .debug(true)
    .count("email_1 as count")
    .where("email_1", req.email)
    .limit(1)
    .first();

  log.debug("Email %s count result: %o", req.email, aRow);

  if (!aRow) {
    const ex = new InternalServerError({
      message: "Email uniqueness check fail: query result falsy.",
    });
    return Err(ex);
  }

  if (!hasKey(aRow, "count")) {
    const ex = new InternalServerError({
      message: "Email uniqueness check fail: query result property missing.",
    });
    return Err(ex);
  }

  if (!aRow.count || typeof aRow.count !== "number" || !isFinite(aRow.count)) {
    const ex = new InternalServerError({
      message: "Email uniqueness check fail: Count is not a finite integer.",
    });
    return Err(ex);
  }

  if (aRow.count > 0) {
    const ex = new BadRequestError("Email provided already exists");
    return Err(ex);
  }
  log.debug("Email uniqueness check passed: %s", req.email);
  return Ok.EMPTY;
}
