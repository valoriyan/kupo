import { client } from "./client";
import { DefaultApi } from "./generated/services/default-api";

export * from "./client";
export * from "./generated/types";

export const Api = new DefaultApi(undefined, "", client);
