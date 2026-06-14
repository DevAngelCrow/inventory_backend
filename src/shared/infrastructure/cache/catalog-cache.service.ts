import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * Read-through cache for catalog-style queries (slow-changing reference data).
 *
 * Pattern:
 *   const result = await this.cache.fetch('countries:list', 3600, () => repo.getAll());
 *
 * Use only for data that's safe to be slightly stale (catalog tables that
 * change rarely). Always pair writes with invalidate() in the corresponding
 * command handler so cached entries don't outlive their truth.
 *
 * TTL is in SECONDS to match the typical operator mental model; the underlying
 * cache-manager expects milliseconds, so we multiply.
 */
@Injectable()
export class CatalogCacheService {
  private readonly logger = new Logger(CatalogCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async fetch<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    try {
      const hit = await this.cache.get<T>(key);
      if (hit !== undefined && hit !== null) {
        return hit;
      }
    } catch (err) {
      // Cache backend down — fall through to factory. Never let cache failures
      // break the request path.
      this.logger.warn(
        `Cache GET failed for key "${key}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    const value = await factory();
    try {
      await this.cache.set(key, value, ttlSeconds * 1000);
    } catch (err) {
      this.logger.warn(
        `Cache SET failed for key "${key}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    return value;
  }

  async invalidate(key: string): Promise<void> {
    try {
      await this.cache.del(key);
    } catch (err) {
      this.logger.warn(
        `Cache DEL failed for key "${key}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
