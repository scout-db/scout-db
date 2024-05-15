import { DiagLogLevel } from "@opentelemetry/api";
import { Err, Ok, Result } from "ts-results";

import { isEnumValue } from "../is-enum-value";

export const DIAG_LOG_LEVEL_VALUES = [0, 30, 50, 60, 70, 80, 9999] as const;

export const DIAG_LOG_LEVEL_KEYS = [
  "NONE",
  "ERROR",
  "WARN",
  "INFO",
  "DEBUG",
  "VERBOSE",
  "ALL",
];

export function diagLogLevelFromString(
  x: unknown,
): Result<DiagLogLevel, Error> {
  const fnTag = `diagLogLevelFromString()`;
  if (typeof x !== "string") {
    return Err(new TypeError(`${fnTag} Expected string, got ${typeof x}`));
  }
  if (!DIAG_LOG_LEVEL_KEYS.includes(x)) {
    return Err(
      new TypeError(`${fnTag} Invalid OpenTelemetry DiagLogLevel: ${x}`),
    );
  }
  const out = DiagLogLevel[x as keyof typeof DiagLogLevel];
  if (!isEnumValue(DiagLogLevel)(out)) {
    return Err(new Error(`${fnTag} Failed to convert ${x} to DiagLogLevel`));
  } else {
    return Ok(out);
  }
}
