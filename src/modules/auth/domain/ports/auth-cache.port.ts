export abstract class AuthCachePort {
  abstract cacheUserPermissions(
    userId: string,
    permissions: string[],
    ttlMs: number,
  ): Promise<void>;
}
