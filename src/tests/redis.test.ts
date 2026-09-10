import test from 'node:test';
import assert from 'node:assert';
import {
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheGetOrSet,
  cacheFlushPattern,
} from '../lib/redis';

test('redis: client initializes when environment variables are present', async () => {
  const client = getRedisClient();
  assert.ok(client, 'Redis client must be initialized with UPSTASH_REDIS_REST_URL and TOKEN');
  const pong = await client.ping();
  assert.equal(pong, 'PONG', 'Redis server should reply with PONG');
});

test('redis: cacheSet and cacheGet roundtrip primitive and complex objects', async () => {
  const testKey = `test:object:${Date.now()}`;
  const payload = {
    appName: 'CAREER-GUD',
    metric: 42,
    tags: ['education', 'secondary', 'counseling'],
    metadata: { valid: true },
  };

  const setResult = await cacheSet(testKey, payload, 30);
  assert.equal(setResult, true, 'cacheSet must return true on success');

  const cached = await cacheGet<typeof payload>(testKey);
  assert.deepEqual(cached, payload, 'cacheGet must return the exact object saved');

  // Clean up
  await cacheDelete(testKey);
  const afterDelete = await cacheGet(testKey);
  assert.equal(afterDelete, null, 'Deleted key must return null');
});

test('redis: cacheGetOrSet provides seamless read-through caching', async () => {
  const cacheKey = `test:getorset:${Date.now()}`;
  let computeCounter = 0;

  const expensiveCompute = async () => {
    computeCounter++;
    return { value: 'computed_result', execution: computeCounter };
  };

  // First call - cache miss, should invoke expensiveCompute
  const firstResult = await cacheGetOrSet(cacheKey, expensiveCompute, 30);
  assert.equal(firstResult.execution, 1);
  assert.equal(computeCounter, 1);

  // Allow short propagation for background write
  await new Promise((r) => setTimeout(r, 150));

  // Second call - cache hit, should NOT invoke expensiveCompute
  const secondResult = await cacheGetOrSet(cacheKey, expensiveCompute, 30);
  assert.equal(secondResult.execution, 1, 'Should return cached result with execution=1');
  assert.equal(computeCounter, 1, 'expensiveCompute must not be called a second time');

  // Clean up
  await cacheDelete(cacheKey);
});

test('redis: cacheDelete supports multi-key eviction', async () => {
  const key1 = `test:multi:1:${Date.now()}`;
  const key2 = `test:multi:2:${Date.now()}`;

  await cacheSet(key1, 'val1', 30);
  await cacheSet(key2, 'val2', 30);

  assert.equal(await cacheGet(key1), 'val1');
  assert.equal(await cacheGet(key2), 'val2');

  const delResult = await cacheDelete([key1, key2]);
  assert.equal(delResult, true);

  assert.equal(await cacheGet(key1), null);
  assert.equal(await cacheGet(key2), null);
});

test('redis: cacheFlushPattern evicts keys matching wildcard', async () => {
  const prefix = `test:flush:${Date.now()}`;
  await cacheSet(`${prefix}:a`, 'alpha', 30);
  await cacheSet(`${prefix}:b`, 'beta', 30);

  const evicted = await cacheFlushPattern(`${prefix}:*`);
  assert.ok(evicted >= 2, 'Pattern flush should evict matching keys');

  assert.equal(await cacheGet(`${prefix}:a`), null);
  assert.equal(await cacheGet(`${prefix}:b`), null);
});

test('redis: handles non-existent keys gracefully without error', async () => {
  const nonExistent = await cacheGet('completely:non:existent:key:999999');
  assert.equal(nonExistent, null, 'Non-existent key should return null without throwing');
});
