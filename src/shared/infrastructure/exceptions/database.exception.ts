import { InfrastructureException } from './infrastructure.exception';

export class DatabaseException extends InfrastructureException {
  constructor(message: string = 'Database error occurred', operation?: string) {
    super(
      message,
      operation ? `DATABASE_${operation.toUpperCase()}` : 'DATABASE_ERROR',
    );
  }
}
