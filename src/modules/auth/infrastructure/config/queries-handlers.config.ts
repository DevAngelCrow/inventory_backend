import { EmailVerificationValidationHandler } from '../../application/queries/email-verification-validation/email-verification-validation.handler';
import { GetSessionsHandler } from '../../application/queries/get-sessions/get-sessions.handler';

export const queryHandlerProviders = [
  EmailVerificationValidationHandler,
  GetSessionsHandler,
];
