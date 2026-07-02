export abstract class AuditLoggerPort {
  abstract warn(message: string): void;
  abstract error(message: string, trace?: string): void;
  abstract log(message: string): void;
}
