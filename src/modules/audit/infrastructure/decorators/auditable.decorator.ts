import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../../domain/enums/audit-action.enum';

export const AUDITABLE_KEY = 'audit:auditable';

export type AuditableOptions = {
  action: AuditAction;
  /** Business entity affected ('User', 'Document', etc). Optional. */
  entityType?: string;
  /**
   * Where to read the entity_id from. Defaults to `params.id`. Use 'body.foo'
   * to read from request body, or pass a function for custom resolution.
   */
  entityIdFrom?:
    | string
    | ((ctx: {
        params: Record<string, unknown>;
        body: Record<string, unknown>;
        result: unknown;
      }) => string | undefined);
};

/**
 * Marks an endpoint for automatic audit logging by {@link AuditableInterceptor}.
 *
 * Logs are emitted only on success (the interceptor wraps the handler with
 * tap). Failed requests don't generate audit entries here — failures are
 * surfaced via the global exception filter / structured logs instead.
 *
 * Example:
 *   ⁠@Auditable({ action: AuditAction.LOGIN_SUCCESS })
 *   ⁠@Post('login')
 *   async login() {}
 */
export const Auditable = (options: AuditableOptions) =>
  SetMetadata(AUDITABLE_KEY, options);
