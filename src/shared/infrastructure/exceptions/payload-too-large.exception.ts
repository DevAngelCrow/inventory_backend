import { InfrastructureException } from './infrastructure.exception';

export class PayloadTooLargeException extends InfrastructureException {
  constructor(message: string = 'Payload too large') {
    super(message, 'PAYLOAD_TOO_LARGE');
  }
}
