import { InfrastructureException } from './infrastructure.exception';

export class ExternalServiceException extends InfrastructureException {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR');
  }
}
