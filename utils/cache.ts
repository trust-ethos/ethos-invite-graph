// Caching utility for Ethos API responses
// Implements in-memory cache with TTL and LRU eviction

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Maximum number of entries

  // Default TTLs for different data types
  private readonly defaultTTLs = {
    profile: 5 * 60 * 1000, // 5 minutes - profiles change occasionally
    network: 10 * 60 * 1000, // 10 minutes - network data is more static
    invitations: 3 * 60 * 1000, // 3 minutes - invitation lists can change
    search: 2 * 60 * 1000, // 2 minutes - search results change often
  };

  set<T>(
    key: string,
    data: T,
    type: keyof typeof this.defaultTTLs = "profile",
  ): void {
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const ttl = this.defaultTTLs[type];
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries (LRU-style)
  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Sort by age (oldest first)
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);

    // Remove expired entries first
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }

    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const remainingEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);

      const toRemove = remainingEntries.slice(
        0,
        Math.floor(this.maxSize * 0.2),
      ); // Remove 20%
      for (const [key] of toRemove) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    const expired =
      entries.filter((entry) => now - entry.timestamp > entry.ttl).length;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expired,
      active: this.cache.size - expired,
    };
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Helper functions for common cache patterns
export function getCacheKey(
  type: string,
  ...parts: (string | number)[]
): string {
  return `${type}:${parts.join(":")}`;
}

export async function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheType: "profile" | "network" | "invitations" | "search" = "profile",
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached) {
    console.log(`🎯 Cache HIT: ${key}`);
    return cached;
  }

  // Cache miss - fetch and store
  console.log(`🔄 Cache MISS: ${key} - fetching...`);
  const data = await fetcher();
  cache.set(key, data, cacheType);

  return data;
}
