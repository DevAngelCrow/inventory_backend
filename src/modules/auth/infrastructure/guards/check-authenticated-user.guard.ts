import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_AUTHENTICATED_USER } from '../decorators/check-authenticated-user.decorator';
import { ForbiddenException } from '@/shared/application/exceptions/forbidden.exception';

@Injectable()
export class CheckAuthenticatedUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const paramName = this.reflector.get<string>(
      CHECK_AUTHENTICATED_USER,
      context.getHandler(),
    );
    if (!paramName) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;
    const paramValue = params[paramName];
    if (!user || (user.id !== paramValue && user.user_name !== paramValue)) {
      if (user?.permissions?.includes('ver-perfil-usuario')) {
        return true;
      }
      throw new ForbiddenException(
        'No tienes permiso para acceder a un recurso ajeno',
      );
    }
    return true;
  }
}
