import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn("⚠️ Redis credentials missing. Caching disabled.");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://example.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'example_token',
});

const PROJECT_PREFIX = "jusbill_v3";

export const getKey = (key) => `${PROJECT_PREFIX}:${key}`;
