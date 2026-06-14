import { ValidationException } from './validation.exception';

export class InvalidValueObjectException extends ValidationException {
  constructor(valueObjectName: string, message: string) {
    super(`${valueObjectName}: ${message}`);
    this.name = 'InvalidValueObjectException';
  }
}
