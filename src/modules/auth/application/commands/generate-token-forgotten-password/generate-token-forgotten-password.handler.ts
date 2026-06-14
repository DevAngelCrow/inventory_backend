import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { authPasswordResetTotal } from '@/shared/infrastructure/health/business-metrics';
import { GenerateTokenForgottenPasswordCommand } from './generate-token-forgotten-password.command';
import { VerificationTokenRepository } from '@/modules/auth/domain/repositories/verification-token-repository';
import { GetUserByEmailService } from '@/modules/identity-access-management/application/services/get-user-by-email.service';
import { UserId } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-id';
import { EmailSenderPort } from '@/modules/auth/domain/ports/email-sender.port';
import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';
import { UserName } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-name';

@CommandHandler(GenerateTokenForgottenPasswordCommand)
export class GenerateTokenForgottenPasswordHandler implements ICommandHandler<GenerateTokenForgottenPasswordCommand> {
  constructor(
    private readonly getUserByEmail: GetUserByEmailService,
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly emailSenderPort: EmailSenderPort,
  ) {}
  async execute(command: GenerateTokenForgottenPasswordCommand): Promise<void> {
    const user = await this.getUserByEmail.run(command.email);

    if (!user || !user.id) {
      // Constant-time guard: mimic the ~email-send latency so callers
      // cannot distinguish registered from unregistered addresses.
      await new Promise<void>((resolve) => setTimeout(resolve, 300));
      return;
    }
    const { token, id } =
      await this.verificationTokenRepository.createTokenForForgottenPassword(
        new UserId(user.id),
      );
    await this.emailSenderPort.sendForgottenPasswordEmail(
      new PersonEmail(user.email!),
      new UserName(user.user_name),
      { token, id },
    );
    authPasswordResetTotal.inc({ step: 'requested' });
  }
}
