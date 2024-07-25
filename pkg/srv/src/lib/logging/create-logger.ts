import { pino } from "pino";

import { AppLogLevel } from "../../types/app-log-level.js";
import { ISharedGlobalState } from "../state/shared-global-state.js";

export const DEFAULT_APP_LOG_LEVEL: AppLogLevel = "info";

export function createLogger(
  opts: Record<string, unknown> & {
    readonly sgs: ISharedGlobalState;
    readonly level?: AppLogLevel;
    readonly name?: string;
  },
): pino.Logger {
  const level = opts.level ?? opts.sgs.logLevel ?? DEFAULT_APP_LOG_LEVEL;
  console.log("level ", level);

  const transports = pino.transport({
    targets: [
      {
        target: "pino-pretty",
        options: {
          singleLine: true,
        },
      },
    ],
  });

  const logger = pino(
    {
      level,
      name: opts.name,
      errorKey: "ex",
      redact: {
        paths: ["email", "password", "token"],
      },
    },
    transports,
  );
  return logger;
}
