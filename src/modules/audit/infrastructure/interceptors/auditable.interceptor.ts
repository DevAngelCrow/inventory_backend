import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AuditLogService } from '../../application/services/audit-log.service';
import {
  AUDITABLE_KEY,
  AuditableOptions,
} from '../decorators/auditable.decorator';

type AuthUserLike = { id?: string; user_name?: string } | undefined;

/**
 * Reads {@link Auditable} metadata and emits an entry on successful response.
 * Apply per-controller via `@UseInterceptors(AuditableInterceptor)` or
 * globally via APP_INTERCEPTOR in AppModule for blanket coverage.
 */
@Injectable()
export class AuditableInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLog: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.get<AuditableOptions | undefined>(
      AUDITABLE_KEY,
      context.getHandler(),
    );
    if (!options) return next.handle();
    if (context.getType() !== 'http') return next.handle();

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUserLike }>();
    const user = request.user;

    return next.handle().pipe(
      tap((result: unknown) => {
        try {
          this.auditLog.log({
            action: options.action,
            user_id: user?.id ?? null,
            user_name: user?.user_name ?? null,
            ip_address: this.extractIp(request),
            user_agent: this.extractUserAgent(request),
            entity_type: options.entityType ?? null,
            entity_id: this.resolveEntityId(options, request, result) ?? null,
          });
        } catch {
          // AuditLogService.log already swallows persistence failures; this
          // catch protects against synchronous extractor errors so they can't
          // turn a 200 response into a 500.
        }
      }),
    );
  }

  private resolveEntityId(
    options: AuditableOptions,
    request: Request,
    result: unknown,
  ): string | undefined {
    if (typeof options.entityIdFrom === 'function') {
      return options.entityIdFrom({
        params: request.params ?? {},
        body: (request.body as Record<string, unknown>) ?? {},
        result,
      });
    }
    const path = options.entityIdFrom ?? 'params.id';
    const [source, ...rest] = path.split('.');
    let root: unknown;
    if (source === 'params') root = request.params;
    else if (source === 'body') root = request.body;
    else if (source === 'result') root = result;
    else return undefined;
    const value = rest.reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, root);
    return typeof value === 'string' ? value : undefined;
  }

  private extractIp(req: Request): string | null {
    const forwarded = (
      req.headers as Record<string, string | string[] | undefined>
    )['x-forwarded-for'];
    if (forwarded) {
      const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return first.split(',')[0].trim();
    }
    return req.socket?.remoteAddress ?? null;
  }

  private extractUserAgent(req: Request): string | null {
    const ua = (req.headers as Record<string, string | string[] | undefined>)[
      'user-agent'
    ];
    if (!ua) return null;
    return Array.isArray(ua) ? ua[0] : ua;
  }
}
