import { EmailSenderPort } from '../../domain/ports/email-sender.port';
import { UserRepository } from '../../../identity-access-management/domain/repositories/user-repository';
import { VerificationTokenRepository } from '../../domain/repositories/verification-token-repository';
import { ImplUserRepository } from '../../../identity-access-management/infrastructure/implementation/impl-user.repository';
import { ImplVerificationTokenRepository } from '../implementation/impl-verification-token.repository';

import { EmailQueueService } from '../services/emailQueue.service';
import { CreateOrUpdateRefreshTokenPort } from '../../domain/ports/create-or-update-refresh-token.port';
import { ImplAuthPort } from '../implementation/auth-port-implementation/impl-auth.port';
import { AuthReadPort } from '../../application/ports/auth-read.port';
import { UserReadRepository } from '@/modules/identity-access-management/application/repositories/user-read.repository';

export const repositories = [
  // EmailSenderPort → EmailQueueService: handlers fire-and-forget via BullMQ.
  // Processors inject ImplAuthPort directly (via useExisting alias below) to
  // call the real Resend sender without going through the queue again.
  { provide: EmailSenderPort, useClass: EmailQueueService },
  {
    provide: VerificationTokenRepository,
    useClass: ImplVerificationTokenRepository,
  },
  { provide: UserRepository, useClass: ImplUserRepository },
  { provide: UserReadRepository, useClass: ImplUserRepository },
  {
    provide: CreateOrUpdateRefreshTokenPort,
    useClass: ImplAuthPort,
  },
  {
    provide: AuthReadPort,
    useClass: ImplAuthPort,
  },
  // Alias so processors can inject ImplAuthPort directly (same singleton as AuthReadPort).
  { provide: ImplAuthPort, useExisting: AuthReadPort },
];
