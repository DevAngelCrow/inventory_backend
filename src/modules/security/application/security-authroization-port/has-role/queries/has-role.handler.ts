import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityAuthorizationPort } from '@/modules/security/domain/ports/security-authorization.port';
import { HasRoleQuery } from './has-role.query';

@QueryHandler(HasRoleQuery)
export class HasRoleHandler implements IQueryHandler<HasRoleQuery> {
  constructor(
    private readonly securityAuthorizationPort: SecurityAuthorizationPort,
  ) {}
  async execute(query: HasRoleQuery): Promise<boolean> {
    return await this.securityAuthorizationPort.hasRole(
      query.role,
      query.id_user,
    );
  }
}
