import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthReadPort } from '../../ports/auth-read.port';
import { EmailVerificationValidationQuery } from './email-verification-validation.query';

@QueryHandler(EmailVerificationValidationQuery)
export class EmailVerificationValidationHandler implements IQueryHandler<EmailVerificationValidationQuery> {
  constructor(private readonly emailVerification: AuthReadPort) {}
  public async execute(
    query: EmailVerificationValidationQuery,
  ): Promise<boolean> {
    const { user_dto } = query;
    return await this.emailVerification.hasVerifiedEmail(user_dto);
  }
}
