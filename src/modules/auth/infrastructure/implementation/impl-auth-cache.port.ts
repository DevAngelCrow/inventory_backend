import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthCachePort } from '../../domain/ports/auth-cache.port';

@Injectable()
export class ImplAuthCachePort implements AuthCachePort {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async cacheUserPermissions(
    userId: string,
    permissions: string[],
    ttlMs: number,
  ): Promise<void> {
    await this.cacheManager.set(`user:${userId}:permissions`, permissions, ttlMs);
  }
}
