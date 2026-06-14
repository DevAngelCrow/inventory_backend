import { Inject, Injectable } from '@nestjs/common';
import { CachePort } from '../../domain/ports/cache.port';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ImplCachePort implements CachePort {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async invalidateUsersPermissions(idsUser: string[]): Promise<void> {
    try {
      if (idsUser.length === 0) return;
      const keys = idsUser.flatMap((id) => [
        `user:${id}:permissions`,
        `user:${id}:roles`,
        `user:${id}:menu`,
      ]);
      await this.cacheManager.mdel(keys);
    } catch (error) {
      console.error(
        `Error invalidating cache for users ${idsUser.join(', ')}:`,
        error,
      );
    }
  }
  async invalidateUserPermissions(userId: string): Promise<void> {
    try {
      await this.cacheManager.mdel([
        `user:${userId}:permissions`,
        `user:${userId}:roles`,
        `user:${userId}:menu`,
      ]);
    } catch (error) {
      console.error(`Error invalidating cache for user ${userId}:`, error);
    }
  }
}
