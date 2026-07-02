import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus, IQuery } from '@nestjs/cqrs';
import { Request } from 'express';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ForbiddenException } from '@/shared/application/exceptions/forbidden.exception';
import { BadRequestException } from '@/shared/domain/exceptions/bad-request.exception';

/**
 * Metadata key set by {@link OwnsResource}. Read by {@link OwnsResourceGuard}.
 */
export const OWNS_RESOURCE_KEY = 'shared:owns-resource';

/**
 * Authenticated user shape this guard expects to find on `req.user`. It's the
 * shape Passport-JWT builds from {@link JwtStrategy.validate} — keep this in
 * sync with that file.
 */
export type AuthenticatedUser = {
  id: string;
  id_people?: string;
  permissions?: string[];
};

export type OwnsResourceOptions<TEntity = unknown> = {
  /** URL param name that holds the resource id. Defaults to `id`. */
  paramKey?: string;
  /**
   * QueryBus query constructor used to fetch the resource by id. Must return
   * the entity (or null). Whatever your `Get<X>ByIdQuery` does already works.
   */
  query: new (id: string) => IQuery;
  /**
   * Extracts the owner identifier from the fetched entity. Implementations
   * usually return `entity.getIdPeople().value()` or `entity.getIdUser().value()`.
   */
  getOwnerId: (entity: TEntity) => string | undefined | null;
  /**
   * Which authenticated-user field to compare against. Use `id_people` for
   * resources owned by a person (address, document) and `id` for resources
   * owned directly by the user. Defaults to `id_people`.
   */
  authField?: 'id' | 'id_people';
  /**
   * If the caller's `req.user.permissions` contains ANY of these names, the
   * ownership check is skipped (admin override). Use this on endpoints shared
   * by regular users (acting on their own data) and admins/supervisors (who
   * legitimately act on anyone's data). Names must be granted by your
   * permission seeds — they aren't created automatically.
   */
  bypassWithPermissions?: string[];
};

/**
 * Marks a route as requiring the authenticated user to own the resource
 * identified by `paramKey`. Apply alongside `@UseGuards(OwnsResourceGuard)`.
 *
 * Example:
 *   ⁠@UseGuards(OwnsResourceGuard)
 *   ⁠@OwnsResource<Address>({
 *     paramKey: 'id',
 *     query: GetAddressByIdQuery,
 *     getOwnerId: (a) => a.getIdPeople().value(),
 *     authField: 'id_people',
 *   })
 *   ⁠@Put('addresses/:id')
 *   async update(...) {}
 */
export const OwnsResource = <T = unknown>(options: OwnsResourceOptions<T>) =>
  SetMetadata(OWNS_RESOURCE_KEY, options);

@Injectable()
export class OwnsResourceGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly queryBus: QueryBus,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<OwnsResourceOptions | undefined>(
      OWNS_RESOURCE_KEY,
      context.getHandler(),
    );
    if (!options) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const paramKey = options.paramKey ?? 'id';
    const resourceId = request.params?.[paramKey];
    if (typeof resourceId !== 'string' || resourceId.length === 0) {
      throw new BadRequestException(
        `Missing required route parameter "${paramKey}"`,
      );
    }

    // Admin override — checked BEFORE the entity is fetched so admins don't
    // pay the query cost on every call.
    if (options.bypassWithPermissions?.length) {
      const userPerms = request.user?.permissions ?? [];
      const hasBypass = options.bypassWithPermissions.some((p) =>
        userPerms.includes(p),
      );
      if (hasBypass) return true;
    }

    const entity = await this.queryBus.execute<IQuery, unknown>(
      new options.query(resourceId),
    );
    if (entity === null || entity === undefined) {
      throw new NotFoundException('Resource', resourceId);
    }

    const ownerId = options.getOwnerId(entity);
    const authField = options.authField ?? 'id_people';
    const authValue = request.user?.[authField];

    if (!authValue || !ownerId || ownerId !== authValue) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

    return true;
  }
}
