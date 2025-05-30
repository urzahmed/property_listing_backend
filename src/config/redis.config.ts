import { Redis } from '@upstash/redis';

// Validate required environment variables
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.error('Error: Upstash Redis credentials are missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your .env file');
  process.exit(1);
}

// Initialize Redis client
const redis = new Redis({
  url: String(UPSTASH_REDIS_REST_URL),
  token: String(UPSTASH_REDIS_REST_TOKEN),
});

// Test Redis connection
redis.ping()
  .then(() => console.log('Successfully connected to Upstash Redis'))
  .catch((error) => {
    console.error('Failed to connect to Upstash Redis:', error);
    process.exit(1);
  });

// Cache TTL in seconds
export const CACHE_TTL = {
  PROPERTY_LIST: 300, // 5 minutes
  PROPERTY_DETAIL: 600, // 10 minutes
  PROPERTY_SEARCH: 300, // 5 minutes
};

export default redis; 