import { DomainException } from './domain.exception';
import { ErrorCode } from '@/shared/domain/enums/error-code.enum';

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`, ErrorCode.RESOURCE_NOT_FOUND);
    this.name = 'NotFoundException';
  }
}
