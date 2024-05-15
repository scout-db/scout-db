// @see https://github.com/open-telemetry/opentelemetry-js/issues/3580#issuecomment-1701157270
// Without this the following error occurs:
// 10 export declare function sendWithBeacon(body: string, url: string, blobPropertyBag: BlobPropertyBag, onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
// ~~~~~~~~~~~~~~~

export {};
declare global {
  type BlobPropertyBag = unknown;
}
