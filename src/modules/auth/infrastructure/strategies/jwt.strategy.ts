import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@/shared/application/exceptions/unauthorized.exception';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
export interface JwtPayload {
  user_name: string;
  id: string;
  iat?: number;
  exp?: number;
}
const PERMISSIONS_CACHE_TTL_MS = 3_600_000;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly userRepository: UserReadRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }
  async validate(payload: JwtPayload) {
    let loggedOutAt: number | undefined;
    try {
      loggedOutAt = await this.cacheManager.get<number>(
        `blacklist:user:${payload.id}`,
      );
    } catch (error) {
      this.logger.warn(
        `Unable to read access-token blacklist for user ${payload.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (
      loggedOutAt !== null &&
      loggedOutAt !== undefined &&
      payload.iat !== undefined &&
      loggedOutAt >= payload.iat
    ) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    const cacheKey = `user:${payload.id}:permissions`;
    let permissions: string[] | undefined;

    try {
      const cachedPermissions = await this.cacheManager.get<unknown>(cacheKey);
      if (Array.isArray(cachedPermissions)) {
        permissions = cachedPermissions.filter(
          (permission): permission is string => typeof permission === 'string',
        );
      }
    } catch (error) {
      this.logger.warn(
        `Unable to read permissions cache for user ${payload.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // id_people is needed by guards that check ownership on person-scoped
    // resources (addresses, documents, etc) — see OwnsResourceGuard. Fetched
    // once per cache window alongside permissions.
    const idPeopleCacheKey = `user:${payload.id}:id_people`;
    let idPeople: string | undefined;

    if (!permissions || permissions.length === 0) {
      const user = await this.userRepository.getOneByIdForAuth(payload.id);
      if (!user) {
        throw new UnauthorizedException('Invalid token: user does not exist');
      }

      permissions = user.permissions;
      idPeople = user.id_people;

      try {
        await this.cacheManager.set(
          cacheKey,
          permissions,
          PERMISSIONS_CACHE_TTL_MS,
        );
        await this.cacheManager.set(
          idPeopleCacheKey,
          idPeople,
          PERMISSIONS_CACHE_TTL_MS,
        );
      } catch (error) {
        this.logger.warn(
          `Unable to store permissions cache for user ${payload.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } else {
      try {
        const cached = await this.cacheManager.get<string>(idPeopleCacheKey);
        if (typeof cached === 'string') {
          idPeople = cached;
        }
      } catch {
        // Cache backend down — fall through; the guard will reject ownership
        // checks but auth still works for routes that don't need id_people.
      }
    }

    return {
      user_name: payload.user_name,
      id: payload.id,
      id_people: idPeople,
      permissions,
    };
  }
}
