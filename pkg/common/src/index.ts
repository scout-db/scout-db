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

export { hasKey } from "./lib/types/has-key.js";

export { RankLongName } from "./generated/openapi/typescript-axios/api.js";
export { Scout } from "./generated/openapi/typescript-axios/api.js";
export { ScoutBeenToJubileeEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanCarveWoodEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanCookEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanFirstAidEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanLeadCampfireEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanMakeSausageEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanSetFireEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutCanTrainOthersEnum } from "./generated/openapi/typescript-axios/api.js";
export { ScoutRankEnum } from "./generated/openapi/typescript-axios/api.js";

import * as OpenApiJson from "./openapi.json";
export { OpenApiJson };