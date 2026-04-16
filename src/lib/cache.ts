/**
 * Simple In-Memory Cache Singleton
 * Implementation of the "Memorize" requirement (Phase B)
 */

type CacheEntry = {
  data: any;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 3600000; // 1 Hour in milliseconds

export const DataCache = {
  set: (key: string, data: any) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  get: (key: string) => {
    const entry = cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > DEFAULT_TTL;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  },

  clear: () => cache.clear(),
};
