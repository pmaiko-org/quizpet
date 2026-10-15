import type { $Fetch, NitroFetchRequest } from "nitropack";

export type TApiFetch = $Fetch<unknown, NitroFetchRequest>;

export type TRequestOptions = {
  signal?: AbortSignal;
};
