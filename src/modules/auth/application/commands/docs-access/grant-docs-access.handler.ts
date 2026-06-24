import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@/shared/application/exceptions/forbidden.exception';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';
import { AuditLogService } from '@/modules/audit/application/services/audit-log.service';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';
import { GrantDocsAccessCommand } from './grant-docs-access.command';

interface JwtPayload {
  id: string;
  user_name: string;
  permissions?: string[];
  exp?: number;
}

@CommandHandler(GrantDocsAccessCommand)
export class GrantDocsAccessHandler implements ICommandHandler<GrantDocsAccessCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userReadRepository: UserReadRepository,
    private readonly auditLog: AuditLogService,
  ) {}

  async execute(command: GrantDocsAccessCommand): Promise<{ cookieToken: string; maxAge: number }> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(command.access_token);
    } catch {
      throw new ForbiddenException('Token inválido o expirado');
    }

    const user = await this.userReadRepository.getOneByIdForAuth(payload.id);
    if (!user || !user.permissions.includes('ver-documentacion-api')) {
      throw new ForbiddenException('No posee permiso para acceder a la documentación de la API');
    }

    const cookieToken = this.jwtService.sign({
      id: payload.id,
      user_name: payload.user_name,
    });
    const decoded = this.jwtService.decode<{ exp?: number }>(cookieToken);
    const maxAge = decoded?.exp
      ? (decoded.exp - Math.floor(Date.now() / 1000)) * 1000
      : 3_600_000;

    this.auditLog.log({
      action: AuditAction.DOCS_ACCESS_GRANTED,
      user_name: payload.user_name,
      user_id: payload.id,
    });

    return { cookieToken, maxAge };
  }
}
