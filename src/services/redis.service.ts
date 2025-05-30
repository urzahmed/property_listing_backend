import redis, { CACHE_TTL } from '../config/redis.config';

class RedisService {
  // Cache property list
  async cachePropertyList(properties: any[]) {
    const key = 'property:list';
    await redis.set(key, JSON.stringify(properties), { ex: CACHE_TTL.PROPERTY_LIST });
  }

  // Get cached property list
  async getCachedPropertyList() {
    const key = 'property:list';
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData as string) : null;
  }

  // Cache property detail
  async cachePropertyDetail(propertyId: string, property: any) {
    const key = `property:detail:${propertyId}`;
    await redis.set(key, JSON.stringify(property), { ex: CACHE_TTL.PROPERTY_DETAIL });
  }

  // Get cached property detail
  async getCachedPropertyDetail(propertyId: string) {
    const key = `property:detail:${propertyId}`;
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData as string) : null;
  }

  // Cache search results
  async cacheSearchResults(query: string, results: any[]) {
    const key = `property:search:${query}`;
    await redis.set(key, JSON.stringify(results), { ex: CACHE_TTL.PROPERTY_SEARCH });
  }

  // Get cached search results
  async getCachedSearchResults(query: string) {
    const key = `property:search:${query}`;
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData as string) : null;
  }

  // Invalidate cache for a property
  async invalidatePropertyCache(propertyId: string) {
    const keys = await redis.keys(`property:*`);
    for (const key of keys) {
      if (key.includes(propertyId) || key === 'property:list') {
        await redis.del(key);
      }
    }
  }

  // Invalidate all property caches
  async invalidateAllPropertyCaches() {
    const keys = await redis.keys('property:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

export default new RedisService(); 