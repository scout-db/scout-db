export { ErrorFromUnknownThrowable } from "./lib/exception/error-from-unknown-throwable.js";
export {
  asError,
  coerceUnknownToError,
} from "./lib/exception/coerce-unknown-to-error.js";
export { ErrorFromSymbol } from "./lib/exception/error-from-symbol.js";
export {
  createRuntimeErrorWithCause,
  newRex,
} from "./lib/exception/create-runtime-error-with-cause.js";

export { DefaultApi as KmcsszApi } from "./generated/openapi/typescript-axios/api.js";
export {
  Configuration as KmcsszApiConfiguration,
  ConfigurationParameters as KmcsszApiConfigurationParameters,
} from "./generated/openapi/typescript-axios/configuration.js";

export { Scout } from "./generated/openapi/typescript-axios/api.js";

import * as OpenApiJson from "./openapi.json";
export { OpenApiJson };