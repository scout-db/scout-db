import process from "process";

import { ContextAPI, Exception, Tracer } from "@opentelemetry/api";
import { context, trace } from "@opentelemetry/api";
import { diag, DiagConsoleLogger } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { setGlobalErrorHandler } from "@opentelemetry/core";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-node";

import { ISharedGlobalState } from "../state/shared-global-state.js";

export interface IOpenTelemetryOptions {
  readonly sgs: ISharedGlobalState;
  /**
   * Instrumenting the file-system operations causes an extreme initial spike in
   * memory usage when the application is booting (it's loading the source files).
   * Since we don't particularly use the file-system too heavily, it's OK to turn
   * this off for now.
   * The static web server component caches things in-memory after the initial load
   * as well so it shouldn't be a concern after the cold start either.
   * @see https://github.com/open-telemetry/opentelemetry-js-contrib/issues/1344
   */
  readonly enableInstrumentationFs: boolean;
}

export interface IOpenTelemetryOut {
  readonly sdk: NodeSDK;
  readonly opts: IOpenTelemetryOptions;
  readonly tracer: Tracer;
  readonly contextApi: ContextAPI;
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
    const msg = JSON.stringify(ex);
    console.warn(`${fnTag} OpenTelemetry global error:`, msg);
    return null;
  });

  const collectorOptions = {
    url: opts.sgs.tracingExporterLogOtlpHttpEndpoint,
    concurrencyLimit: 1, // an optional limit on pending requests
  };
  const logExporter = new OTLPLogExporter(collectorOptions);

  const traceExporter = new OTLPTraceExporter(exporterOptions);
  const logRecordProcessor = new BatchLogRecordProcessor(logExporter);
  const sampler = new TraceIdRatioBasedSampler(opts.sgs.tracingSamplingRatio);

  const nodeAutoInstrumentations = getNodeAutoInstrumentations({
    "@opentelemetry/instrumentation-fs": {
      enabled: opts.enableInstrumentationFs,
    },
  });

  const sdk = new NodeSDK({
    serviceName: opts.sgs.serviceName,
    logRecordProcessor,
    sampler,
    traceExporter,
    instrumentations: [nodeAutoInstrumentations],
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start();
  const tracer = trace.getTracer(opts.sgs.serviceName, opts.sgs.serviceVersion);

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

  return { contextApi: context, sdk, opts, tracer };
}
