import { RegisterHandler } from '../../application/commands/register/register.handler';
import { LoginHandler } from '../../application/commands/login/login.handler';
import { VerifyEmailHandler } from '../../application/commands/email-verification/verify-email.handler';
import { LogoutHandler } from '../../application/commands/logout/logout.handler';
import { RefreshHandler } from '../../application/commands/refresh/refresh.handler';
import { CreateUpdateRefreshTokenHandler } from '../../application/commands/creat-update-refresh-token/create-update-refresh-token.handler';
import { UpdateProfileHandler } from '../../application/commands/update-profile/update-profile.handler';
import { SendVerificationEmailHandler } from '../../application/commands/send-verification-email/send-verification-email.handler';
import { GenerateTokenForgottenPasswordHandler } from '../../application/commands/generate-token-forgotten-password/generate-token-forgotten-password.handler';
import { ResetForgottenPasswordHandler } from '../../application/commands/reset-forgotten-password/reset-forgotten-password.handler';
import { MarkAsUsedTokenHandler } from '../../application/commands/mark-as-used-token/mark-as-used-token.handler';
import { RevokeAllSessionsHandler } from '../../application/commands/revoke-all-sessions/revoke-all-sessions.handler';
import { RevokeSessionHandler } from '../../application/commands/revoke-session/revoke-session.handler';
import { GrantDocsAccessHandler } from '../../application/commands/docs-access/grant-docs-access.handler';

export const commandHandlerProviders = [
  RegisterHandler,
  LoginHandler,
  VerifyEmailHandler,
  LogoutHandler,
  RefreshHandler,
  CreateUpdateRefreshTokenHandler,
  UpdateProfileHandler,
  SendVerificationEmailHandler,
  GenerateTokenForgottenPasswordHandler,
  ResetForgottenPasswordHandler,
  MarkAsUsedTokenHandler,
  RevokeAllSessionsHandler,
  RevokeSessionHandler,
  GrantDocsAccessHandler,
];
