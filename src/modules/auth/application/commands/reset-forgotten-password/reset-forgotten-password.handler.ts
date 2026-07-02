import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { authPasswordResetTotal } from '@/shared/infrastructure/health/business-metrics';
import { ResetPasswordUserService } from '@/modules/identity-access-management/application/services/reset-password-user.service';
import { ResetForgottenPasswordCommand } from './reset-forgotten-password.command';
import { VerificationTokenRepository } from '@/modules/auth/domain/repositories/verification-token-repository';
import { ApplicationException } from '@/shared/application/exceptions/application.exception';
import { AuditLogService } from '@/modules/audit/application/services/audit-log.service';
import { AuditAction } from '@/modules/audit/domain/enums/audit-action.enum';

@CommandHandler(ResetForgottenPasswordCommand)
export class ResetForgottenPasswordHandler implements ICommandHandler<ResetForgottenPasswordCommand> {
  constructor(
    private readonly resetPasswordUserService: ResetPasswordUserService,
    private readonly verifyTokenRepository: VerificationTokenRepository,
    private readonly auditLog: AuditLogService,
  ) {}
  // Returns the user_id resolved from the consumed token so the caller can
  // emit an audit entry with the real user id (the request body only carries
  // the token id, which is NOT the user id — auditing the wrong field would
  // make forensic correlation impossible).
  async execute(
    command: ResetForgottenPasswordCommand,
  ): Promise<{ user_id: string }> {
    const tokenVerified = await this.verifyTokenRepository.findByToken(
      command.id,
      command.token,
    );
    if (!tokenVerified) {
      throw new ApplicationException('404', 'Token no encontrado');
    }
    await this.verifyTokenRepository.markAsUsed(tokenVerified.id);
    await this.verifyTokenRepository.deleteByUserId(
      tokenVerified.user_id,
      true,
    );
    await this.resetPasswordUserService.run(
      tokenVerified.user_id.value(),
      command.password,
      command.token,
    );
    authPasswordResetTotal.inc({ step: 'completed' });
    this.auditLog.log({
      action: AuditAction.PASSWORD_RESET_COMPLETED,
      user_id: tokenVerified.user_id.value(),
      ip_address: command.ip_address,
      user_agent: command.user_agent,
      metadata: {
        token_id: command.id,
        consumed_ip: command.ip_address,
        consumed_user_agent: command.user_agent,
      },
    });
    return { user_id: tokenVerified.user_id.value() };
  }
}
