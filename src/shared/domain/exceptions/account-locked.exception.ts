import { DomainException } from './domain.exception';
import { ErrorCode } from '@/shared/domain/enums/error-code.enum';

export class AccountLockedException extends DomainException {
  constructor(
    public readonly retryAfter: Date,
    message = 'Account is temporarily locked due to too many failed login attempts',
  ) {
    super(message, ErrorCode.AUTH_ACCOUNT_LOCKED);
    this.name = 'AccountLockedException';
  }
}
