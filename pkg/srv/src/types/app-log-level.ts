export type AppLogLevel =
  | "silent"
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace";

export function isAppLogLevel(x: unknown): x is AppLogLevel {
  return (
    typeof x === "string" &&
    ["silent", "fatal", "error", "warn", "info", "debug", "trace"].includes(x)
  );
}
