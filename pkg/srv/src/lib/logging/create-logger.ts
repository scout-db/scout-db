import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
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

  const transports = pino.transport({
    targets: [
      {
        target: "pino-opentelemetry-transport",
        level,
        options: {
          logRecordProcessorOptions: [
            {
              recordProcessorType: "batch",
            },
          ],
          loggerName: opts.sgs.serviceName,
          serviceName: opts.sgs.serviceName,
          serviceVersion: opts.sgs.serviceVersion,
        },
      },
      {
        level,
        target: "pino-pretty",
        options: {
          singleLine: true,
          levelFirst: false,
        },
      },
    ],
  });

  const mixinData: Record<string, unknown> = {
    [SemanticResourceAttributes.SERVICE_NAME]: opts.sgs.serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: opts.sgs.serviceVersion,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: opts.sgs.serviceVersion,
  };

  const logger = pino(
    {
      mixin() {
        return mixinData;
      },
      level,
      redact: {
        paths: ["email", "password", "token"],
      },
    },
    transports,
  );

  return logger;
}
