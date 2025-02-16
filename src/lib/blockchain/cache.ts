interface CacheOptions {
  ttl: number; // Time to live in milliseconds
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

export class BlockchainCache {
  private cache: Map<string, CacheEntry<any>>;
  
  constructor() {
    this.cache = new Map();
  }

  set<T>(key: string, value: T, options: CacheOptions): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now() + options.ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp) {
        this.cache.delete(key);
      }
    }
  }
}