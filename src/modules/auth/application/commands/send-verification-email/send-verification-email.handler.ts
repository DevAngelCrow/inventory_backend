import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailSenderPort } from '@/modules/auth/domain/ports/email-sender.port';
import { VerificationTokenRepository } from '@/modules/auth/domain/repositories/verification-token-repository';
import { SendVerificationEmailCommand } from './send-verification-email.command';
import { UserId } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-id';
import { UserName } from '@/modules/identity-access-management/domain/value-objects/user-value-object/user-name';
import { PersonEmail } from '@/modules/profile/domain/value-objects/person-value-object/person-email';

@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailHandler implements ICommandHandler<SendVerificationEmailCommand> {
  constructor(
    private readonly emailSenderPort: EmailSenderPort,
    private readonly verificationTokenRepository: VerificationTokenRepository,
  ) {}
  public async execute(command: SendVerificationEmailCommand): Promise<void> {
    const { user_id, email, user_name } = command;
    const userId = new UserId(user_id);
    const userName = new UserName(user_name);
    const personEmail = new PersonEmail(email);

    const { token, id } = await this.verificationTokenRepository.create(userId);

    await this.emailSenderPort.sendVerificationEmail(personEmail, userName, {
      token,
      id,
    });
  }
}
