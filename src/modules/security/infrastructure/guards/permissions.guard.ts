import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_ALL_KEY,
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';
import { ForbiddenException } from '@/shared/application/exceptions/forbidden.exception';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const anyPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const allPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_ALL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (
      (!anyPermissions || anyPermissions.length === 0) &&
      (!allPermissions || allPermissions.length === 0)
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.permissions) {
      throw new ForbiddenException(
        'No posee permisos para acceder a este recurso',
      );
    }

    if (anyPermissions && anyPermissions.length > 0) {
      const hasAnyPermission = anyPermissions.some((permission) =>
        user.permissions.includes(permission),
      );
      if (!hasAnyPermission) {
        throw new ForbiddenException(
          'No posee permisos para acceder a este recurso',
        );
      }
    }

    if (allPermissions && allPermissions.length > 0) {
      const hasAllPermissions = allPermissions.every((permission) =>
        user.permissions.includes(permission),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException(
          'No posee permisos para acceder a este recurso',
        );
      }
    }

    return true;
  }
}
