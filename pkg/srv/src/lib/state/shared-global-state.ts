import { DiagLogLevel } from "@opentelemetry/api";

import { AppLogLevel, isAppLogLevel } from "../../types/app-log-level.js";
import { isEnumValue } from "../../types/is-enum-value.js";

export interface ISharedGlobalState {
  readonly tracingExporterTraceOtlpHttpEndpoint: string;
  readonly tracingExporterLogOtlpHttpEndpoint: string;
  readonly tracingDiagLogLevel: DiagLogLevel;
  readonly tracingSamplingRatio: number;
  readonly logLevel: AppLogLevel;
  readonly serviceName: string;
  readonly serviceVersion: string;
  readonly buildVersion: string;
  readonly extras: Map<string, unknown>;
}

export function isISharedGlobalState(x: unknown): x is ISharedGlobalState {
  if (typeof x !== "object" || x === null) {
    return false;
  }
  const y = x as ISharedGlobalState;
  if (typeof y.serviceName !== "string" || y.serviceName.length === 0) {
    return false;
  }
  if (typeof y.serviceVersion !== "string" || y.serviceVersion.length === 0) {
    return false;
  }
  if (typeof y.buildVersion !== "string" || y.buildVersion.length === 0) {
    return false;
  }
  if (!(y.extras instanceof Map)) {
    return false;
  }
  if (!isAppLogLevel(y.logLevel)) {
    return false;
  }
  if (!isEnumValue(DiagLogLevel)(y.tracingDiagLogLevel)) {
    return false;
  }
  if (
    typeof y.tracingExporterTraceOtlpHttpEndpoint !== "string" ||
    y.tracingExporterTraceOtlpHttpEndpoint.length === 0
  ) {
    return false;
  }
  return true;
}
