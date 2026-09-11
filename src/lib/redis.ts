import { Redis } from '@upstash/redis';

// Global singleton to prevent recreating Redis client instances across warm serverless lambdas
const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined;
  l1Cache: Map<string, { data: unknown; expiresAt: number }> | undefined;
};

// In-Memory L1 Cache: protects Upstash Free Tier from bandwidth and command exhaustion
if (!globalForRedis.l1Cache) {
  globalForRedis.l1Cache = new Map();
}
const l1Cache = globalForRedis.l1Cache;
const MAX_L1_ENTRIES = 200;
const L1_DEFAULT_TTL_SEC = 60; // 60 seconds local RAM shield

function pruneL1Cache() {
  if (l1Cache.size > MAX_L1_ENTRIES) {
    const now = Date.now();
    for (const [k, v] of l1Cache.entries()) {
      if (now > v.expiresAt) {
        l1Cache.delete(k);
      }
    }
  }
}

/**
 * Initializes and retrieves the singleton Upstash Redis client.
 * Returns null if UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing or invalid.
 */
export function getRedisClient(): Redis | null {
  if (globalForRedis.redisClient !== undefined) {
    return globalForRedis.redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || !url.startsWith('http')) {
    globalForRedis.redisClient = null;
    return null;
  }

  try {
    const client = new Redis({
      url,
      token,
      retry: {
        retries: 2,
        backoff: (retryCount) => Math.exp(retryCount) * 50,
      },
    });
    globalForRedis.redisClient = client;
    return client;
  } catch (err) {
    console.warn('[Redis] Initialization warning:', err);
    globalForRedis.redisClient = null;
    return null;
  }
}

/**
 * Safely fetches and parses data from Redis (L2) with L1 in-memory acceleration.
 * Returns null if the key doesn't exist, Redis is unconfigured, or an error occurs.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  // 1. Check L1 in-memory cache first (0 Upstash bandwidth, 0 API commands)
  const l1 = l1Cache.get(key);
  if (l1 && Date.now() < l1.expiresAt) {
    return l1.data as T;
  }

  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get<T>(key);
    if (data !== null && data !== undefined) {
      // Warm L1 cache for 60s
      pruneL1Cache();
      l1Cache.set(key, { data, expiresAt: Date.now() + L1_DEFAULT_TTL_SEC * 1000 });
      return data;
    }
    return null;
  } catch (err) {
    console.warn(`[Redis Cache] GET error for key "${key}":`, err);
    return null;
  }
}

/**
 * Stores data in Redis with an explicit Time-To-Live in seconds.
 * Guarantees keys expire so memory in Upstash free tier (256MB) is never bloated.
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number = 1800): Promise<boolean> {
  const safeTtl = Math.max(10, ttlSeconds);

  // Update L1 in-memory cache
  pruneL1Cache();
  l1Cache.set(key, {
    data: value,
    expiresAt: Date.now() + Math.min(safeTtl, L1_DEFAULT_TTL_SEC) * 1000,
  });

  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.set(key, value, { ex: safeTtl });
    return true;
  } catch (err) {
    console.warn(`[Redis Cache] SET error for key "${key}":`, err);
    return false;
  }
}

/**
 * Evicts one or more keys from both L1 RAM and L2 Upstash Redis.
 */
export async function cacheDelete(key: string | string[]): Promise<boolean> {
  // Evict from L1
  if (Array.isArray(key)) {
    key.forEach((k) => l1Cache.delete(k));
  } else {
    l1Cache.delete(key);
  }

  const client = getRedisClient();
  if (!client) return false;

  try {
    if (Array.isArray(key)) {
      if (key.length > 0) {
        await client.del(...key);
      }
    } else {
      await client.del(key);
    }
    return true;
  } catch (err) {
    console.warn(`[Redis Cache] DEL error for key(s) "${key}":`, err);
    return false;
  }
}

/**
 * High-performance read-through caching with Free Tier Bandwidth Protection:
 * 1. Checks L1 in-memory cache (0 network, 0 Upstash cost)
 * 2. Checks Upstash Redis L2 (caches in L1 for 60s)
 * 3. Falls through to fetchFn() on miss, asynchronously caching in both layers.
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 1800
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  const freshData = await fetchFn();

  if (freshData !== null && freshData !== undefined) {
    // Non-blocking write to L1 & Redis
    cacheSet(key, freshData, ttlSeconds).catch((err) =>
      console.warn(`[Redis Cache] Background write failed for key "${key}":`, err)
    );
  }

  return freshData;
}

/**
 * Evicts all keys matching a specific pattern (e.g. "cache:college:*").
 */
export async function cacheFlushPattern(pattern: string): Promise<number> {
  // Clear matching keys in L1
  const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  for (const k of l1Cache.keys()) {
    if (regexPattern.test(k)) {
      l1Cache.delete(k);
    }
  }

  const client = getRedisClient();
  if (!client) return 0;

  try {
    const keys = await client.keys(pattern);
    if (keys && keys.length > 0) {
      await client.del(...keys);
      return keys.length;
    }
    return 0;
  } catch (err) {
    console.warn(`[Redis Cache] Flush pattern error for "${pattern}":`, err);
    return 0;
  }
}

/**
 * Upstash Health & Free-Tier Quota Diagnostic.
 * Verifies connectivity, measures latency in ms, and counts active keys.
 */
export async function getRedisHealth(): Promise<{
  ok: boolean;
  configured: boolean;
  pingMs: number;
  activeKeys: number;
  error?: string;
}> {
  const client = getRedisClient();
  if (!client) {
    return { ok: false, configured: false, pingMs: 0, activeKeys: 0, error: 'Redis unconfigured' };
  }

  try {
    const start = Date.now();
    const pingRes = await client.ping();
    const pingMs = Date.now() - start;
    const activeKeys = await client.dbsize();

    return {
      ok: pingRes === 'PONG',
      configured: true,
      pingMs,
      activeKeys,
    };
  } catch (err: any) {
    return {
      ok: false,
      configured: true,
      pingMs: 0,
      activeKeys: 0,
      error: err?.message || String(err),
    };
  }
}
