import { Redis } from '@upstash/redis';

// Global singleton to prevent recreating Redis client instances across warm serverless lambdas
const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined;
};

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
 * Safely fetches and parses data from Redis.
 * Returns null if the key doesn't exist, Redis is unconfigured, or an error occurs.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get<T>(key);
    return data ?? null;
  } catch (err) {
    console.warn(`[Redis Cache] GET error for key "${key}":`, err);
    return null;
  }
}

/**
 * Stores data in Redis with an optional Time-To-Live in seconds.
 * Returns true on success, false on failure or if Redis is unconfigured.
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await client.set(key, value, { ex: ttlSeconds });
    } else {
      await client.set(key, value);
    }
    return true;
  } catch (err) {
    console.warn(`[Redis Cache] SET error for key "${key}":`, err);
    return false;
  }
}

/**
 * Evicts one or more keys from Redis.
 */
export async function cacheDelete(key: string | string[]): Promise<boolean> {
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
 * Read-through caching pattern.
 * Checks Redis first; if missing or on Redis error, executes fetchFn(),
 * saves the result to Redis asynchronously, and returns the fresh data.
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  const freshData = await fetchFn();

  if (freshData !== null && freshData !== undefined) {
    // Non-blocking background write to Redis
    cacheSet(key, freshData, ttlSeconds).catch((err) =>
      console.warn(`[Redis Cache] Background write failed for key "${key}":`, err)
    );
  }

  return freshData;
}

/**
 * Evicts all keys matching a specific pattern (e.g. "college:*").
 */
export async function cacheFlushPattern(pattern: string): Promise<number> {
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
