import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityAuthorizationPort } from '@/modules/security/domain/ports/security-authorization.port';
import { CheckPermissionsQuery } from './check-permissions.query';

@QueryHandler(CheckPermissionsQuery)
export class CheckPermissionsHandler implements IQueryHandler<CheckPermissionsQuery> {
  constructor(
    private readonly securityAuthorizationPort: SecurityAuthorizationPort,
  ) {}
  async execute(query: CheckPermissionsQuery): Promise<boolean> {
    return await this.securityAuthorizationPort.checkPermission(
      query.permission,
      query.id_user,
    );
  }
}
