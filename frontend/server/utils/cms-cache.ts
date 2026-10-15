import Redis from "ioredis";
import { $fetch as rawFetch } from "ofetch";

import type {
  TCmsBootstrapResponse,
  TCmsLocale,
  TCmsLocaleSetting,
  TCmsPageResolveResponse,
  TCmsRedirect,
} from "../../app/core/cms/types";
import { CMS_PREVIEW_TOKEN_HEADER } from "./cms-preview";

const VERSION_KEY = "cms:content:version";
const CACHE_TTL_SECONDS = 60 * 60;
const MEMORY_CACHE_LIMIT = 256;
const REDIS_COOLDOWN_MS = 30_000;
const REDIS_TIMEOUT_MS = 2_000;
const LOCAL_VERSION = "local";

type TMemoryEntry = {
  value: unknown;
  expiresAt: number;
};

const memoryCache = new Map<string, unknown>();
const staleCache = new Map<string, unknown>();

let redisClient: Redis | undefined;
let redisBlockedUntil = 0;

const remember = (cache: Map<string, unknown>, key: string, value: unknown) => {
  cache.delete(key);
  cache.set(key, value);

  while (cache.size > MEMORY_CACHE_LIMIT) {
    const oldest = cache.keys().next();

    if (oldest.done) {
      break;
    }

    cache.delete(oldest.value);
  }
};

const rememberValue = (baseKey: string, cacheKey: string, value: unknown) => {
  remember(memoryCache, cacheKey, {
    value,
    expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
  } satisfies TMemoryEntry);
  remember(staleCache, baseKey, value);
};

const readMemory = <T>(cacheKey: string): T | undefined => {
  const entry = memoryCache.get(cacheKey) as TMemoryEntry | undefined;

  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(cacheKey);
    return undefined;
  }

  return entry.value as T;
};

type TCmsRuntimeConfig = {
  cmsInternalUrl: string;
  redisUrl: string;
};

const blockRedis = (error: unknown) => {
  const wasAvailable = Date.now() >= redisBlockedUntil;
  redisBlockedUntil = Date.now() + REDIS_COOLDOWN_MS;

  if (wasAvailable) {
    console.warn("Redis is unavailable, CMS cache falls back to memory", error);
  }
};

const createRedis = (url: string) => {
  const client = new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: REDIS_TIMEOUT_MS,
    commandTimeout: REDIS_TIMEOUT_MS,
    retryStrategy: () => REDIS_COOLDOWN_MS,
  });

  client.on("error", blockRedis);

  return client;
};

const useRedis = async (
  config: TCmsRuntimeConfig,
): Promise<Redis | undefined> => {
  if (!config.redisUrl || Date.now() < redisBlockedUntil) {
    return undefined;
  }

  redisClient ??= createRedis(config.redisUrl);

  if (redisClient.status === "ready") {
    return redisClient;
  }

  if (redisClient.status !== "wait" && redisClient.status !== "end") {
    return undefined;
  }

  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    blockRedis(error);
    return undefined;
  }
};

const readRedis = async (redis: Redis, key: string) => {
  try {
    return await redis.get(key);
  } catch (error) {
    blockRedis(error);
    return null;
  }
};

const writeRedis = async (redis: Redis, key: string, value: string) => {
  try {
    await redis.set(key, value, "EX", CACHE_TTL_SECONDS);
  } catch (error) {
    blockRedis(error);
  }
};

const nextVersion = () => String(Date.now());

const getVersion = async (config: TCmsRuntimeConfig): Promise<string> => {
  const redis = await useRedis(config);

  if (!redis) {
    return LOCAL_VERSION;
  }

  try {
    await redis.set(VERSION_KEY, nextVersion(), "NX");

    return (await redis.get(VERSION_KEY)) ?? LOCAL_VERSION;
  } catch (error) {
    blockRedis(error);
    return LOCAL_VERSION;
  }
};

const fetchCms = async <T>(
  config: TCmsRuntimeConfig,
  path: string,
  query?: Record<string, string>,
  previewToken?: string,
): Promise<T> => {
  if (!config.cmsInternalUrl) {
    throw new Error("NUXT_CMS_INTERNAL_URL is required");
  }

  return rawFetch<T>(`${config.cmsInternalUrl}${path}`, {
    query,
    headers: previewToken
      ? { [CMS_PREVIEW_TOKEN_HEADER]: previewToken }
      : undefined,
  });
};

const cached = async <T>(
  config: TCmsRuntimeConfig,
  baseKey: string,
  load: () => Promise<T>,
): Promise<T> => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const version = await getVersion(config);
    const cacheKey = `cms:${version}:${baseKey}`;
    const memoryValue = readMemory<T>(cacheKey);

    if (memoryValue !== undefined) {
      return memoryValue;
    }

    const redis = await useRedis(config);
    const stored = redis ? await readRedis(redis, cacheKey) : null;

    if (stored) {
      const value = JSON.parse(stored) as T;
      rememberValue(baseKey, cacheKey, value);
      return value;
    }

    try {
      const value = await load();

      if ((await getVersion(config)) !== version) {
        continue;
      }

      if (redis) {
        await writeRedis(redis, cacheKey, JSON.stringify(value));
      }

      rememberValue(baseKey, cacheKey, value);
      return value;
    } catch (error) {
      const stale = staleCache.get(baseKey) as T | undefined;

      if (stale) {
        console.warn(
          `Strapi unavailable, using stale CMS snapshot for ${baseKey}`,
          error,
        );
        return stale;
      }

      throw error;
    }
  }

  throw new Error(`CMS content changed repeatedly while loading ${baseKey}`);
};

export const getCmsLocales = (
  config: TCmsRuntimeConfig,
): Promise<TCmsLocaleSetting[]> =>
  cached<TCmsLocaleSetting[]>(config, "locales", async () => {
    const bootstrap = await fetchCms<TCmsBootstrapResponse>(
      config,
      "/bootstrap",
    );
    return bootstrap.locales;
  });

export const getCmsBootstrap = (
  config: TCmsRuntimeConfig,
  locale: TCmsLocale,
): Promise<TCmsBootstrapResponse> =>
  cached<TCmsBootstrapResponse>(config, `bootstrap:${locale}`, () =>
    fetchCms(config, "/bootstrap", { locale }),
  );

export const getCmsPage = (
  config: TCmsRuntimeConfig,
  locale: TCmsLocale,
  path: string,
  previewToken?: string,
): Promise<TCmsPageResolveResponse> => {
  const load = (): Promise<TCmsPageResolveResponse> =>
    fetchCms<TCmsPageResolveResponse>(
      config,
      "/pages/resolve",
      { locale, path, status: previewToken ? "draft" : "published" },
      previewToken,
    );

  return previewToken ? load() : cached(config, `page:${locale}:${path}`, load);
};

export const getCmsRedirects = (
  config: TCmsRuntimeConfig,
): Promise<TCmsRedirect[]> =>
  cached<TCmsRedirect[]>(config, "redirects", () =>
    fetchCms(config, "/redirects"),
  );

export const closeCmsCache = () => {
  redisClient?.disconnect();
  redisClient = undefined;
  redisBlockedUntil = 0;
  memoryCache.clear();
  staleCache.clear();
};

export const revalidateCms = async (
  config: TCmsRuntimeConfig,
): Promise<string> => {
  const version = nextVersion();
  const redis = await useRedis(config);

  memoryCache.clear();

  if (redis) {
    try {
      await redis.set(VERSION_KEY, version);
      return version;
    } catch (error) {
      blockRedis(error);
    }
  }

  return LOCAL_VERSION;
};
