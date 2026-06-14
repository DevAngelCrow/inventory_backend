import { DomainException } from './domain.exception';
import { ErrorCode } from '@/shared/domain/enums/error-code.enum';

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, ErrorCode.RESOURCE_CONFLICT);
    this.name = 'ConflictException';
  }
}
