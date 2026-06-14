import { DomainException } from './domain.exception';
import { ErrorCode } from '@/shared/domain/enums/error-code.enum';

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_FAILED);
    this.name = 'ValidationException';
  }
}
