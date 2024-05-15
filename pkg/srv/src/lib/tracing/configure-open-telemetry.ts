import process from "process";

import { Exception } from "@opentelemetry/api";
import { diag, DiagConsoleLogger } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { setGlobalErrorHandler } from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { AlwaysOnSampler } from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

import { ISharedGlobalState } from "../state/shared-global-state.js";

export interface IOpenTelemetryOptions {
  readonly sgs: ISharedGlobalState;
}

export interface IOpenTelemetryOut {
  readonly sdk: NodeSDK;
  readonly opts: IOpenTelemetryOptions;
}

export async function configureOpenTelemetry(
  opts: IOpenTelemetryOptions,
): Promise<IOpenTelemetryOut> {
  const fnTag = "configureOpenTelemetry()";
  diag.setLogger(new DiagConsoleLogger(), opts.sgs.tracingDiagLogLevel);

  const exporterOptions = {
    url: opts.sgs.tracingExporterTraceOtlpHttpEndpoint,
  };

  setGlobalErrorHandler((ex: Readonly<Exception>): null => {
    console.error(`${fnTag} OpenTelemetry global error handler: `, ex);
    return null;
  });

  const traceExporter = new OTLPTraceExporter(exporterOptions);

  const sdk = new NodeSDK({
    serviceName: opts.sgs.serviceName,
    sampler: new AlwaysOnSampler(),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: opts.sgs.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: opts.sgs.serviceVersion,
    }),
  });
  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start();

  // gracefully shut down the SDK on process exit
  process.on("SIGTERM", async (): Promise<void> => {
    try {
      await sdk.shutdown();
      console.log("Tracing terminated OK.");
    } catch (ex: unknown) {
      console.log("Error terminating tracing:", ex);
    } finally {
      process.exit(0);
    }
  });

  return { sdk, opts };
}
