import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL as string;

export const redis = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: false,
});
