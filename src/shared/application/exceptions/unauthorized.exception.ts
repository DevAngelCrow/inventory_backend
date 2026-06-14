import { ApplicationException } from './application.exception';
import { ErrorCode } from '@/shared/domain/enums/error-code.enum';

export class UnauthorizedException extends ApplicationException {
  constructor(
    message: string = 'Unauthorized access',
    errorCode: string = ErrorCode.UNAUTHORIZED,
  ) {
    super(message, 'UNAUTHORIZED_EXCEPTION', errorCode);
  }
}
