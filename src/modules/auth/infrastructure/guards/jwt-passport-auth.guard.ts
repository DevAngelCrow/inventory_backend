import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { SKIP_AUTH_KEY } from '../decorators/public-route.decorator';

// Infrastructure endpoints that must remain reachable without auth (scraping,
// health probes). Network isolation is provided at the reverse proxy / network
// policy layer, never by this guard.
const PUBLIC_INFRA_PATHS = ['/metrics'];

@Injectable()
export class JwtPassportAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    if (PUBLIC_INFRA_PATHS.includes(request.path)) {
      return true;
    }
    return super.canActivate(context);
  }
}
