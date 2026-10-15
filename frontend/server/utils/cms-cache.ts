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

const memoryCache = new Map<string, unknown>();
const staleCache = new Map<string, unknown>();
let redisClient: Redis | undefined;

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

type TCmsRuntimeConfig = {
  cmsInternalUrl: string;
  redisUrl: string;
};

const getRedis = (config: TCmsRuntimeConfig) => {
  if (!config.redisUrl) {
    throw new Error("NUXT_REDIS_URL is required for the CMS cache");
  }

  redisClient ??= new Redis(config.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  return redisClient;
};

const connectRedis = async (redis: Redis) => {
  if (redis.status === "wait") {
    await redis.connect();
  }
};

const nextVersion = () => String(Date.now());

const getVersion = async (config: TCmsRuntimeConfig): Promise<string> => {
  const redis = getRedis(config);
  await connectRedis(redis);
  await redis.set(VERSION_KEY, nextVersion(), "NX");
  const version = await redis.get(VERSION_KEY);

  if (!version) {
    throw new Error("CMS content version is unavailable in Redis");
  }

  return version;
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
  let version: string;

  try {
    version = await getVersion(config);
  } catch (error) {
    const stale = staleCache.get(baseKey) as T | undefined;
    if (stale) {
      console.warn(
        `Redis unavailable, using stale CMS snapshot for ${baseKey}`,
        error,
      );
      return stale;
    }
    throw error;
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const cacheKey = `cms:${version}:${baseKey}`;
    const memoryValue = memoryCache.get(cacheKey) as T | undefined;

    if (memoryValue) {
      return memoryValue;
    }

    const redis = getRedis(config);
    const stored = await redis.get(cacheKey);
    if (stored) {
      const value = JSON.parse(stored) as T;
      remember(memoryCache, cacheKey, value);
      remember(staleCache, baseKey, value);
      return value;
    }

    try {
      const value = await load();
      const currentVersion = await getVersion(config);

      if (currentVersion !== version) {
        version = currentVersion;
        continue;
      }

      await redis.set(cacheKey, JSON.stringify(value), "EX", CACHE_TTL_SECONDS);
      remember(memoryCache, cacheKey, value);
      remember(staleCache, baseKey, value);
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

export const revalidateCms = async (
  config: TCmsRuntimeConfig,
): Promise<string> => {
  const redis = getRedis(config);
  await connectRedis(redis);
  const version = nextVersion();
  await redis.set(VERSION_KEY, version);
  memoryCache.clear();
  return version;
};
