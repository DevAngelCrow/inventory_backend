import { Injectable, Logger } from '@nestjs/common';
import { AuditLoggerPort } from '../../domain/ports/audit-logger.port';

@Injectable()
export class ImplAuditLoggerPort implements AuditLoggerPort {
  private readonly logger = new Logger('AuditLogService');

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }

  log(message: string): void {
    this.logger.log(message);
  }
}
