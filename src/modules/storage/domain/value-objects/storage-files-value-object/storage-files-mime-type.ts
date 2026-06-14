import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class StorageFilesMimeType {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('storage files mime type', msg);
    this._value = Validator.of(value, createException)
      .required('Storage files mime type is required')
      .string('Storage files mime type must be a string')
      .minLength(1, 'Storage files mime type must be at least 1 character long')
      .maxLength(
        150,
        'Storage files mime type must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: StorageFilesMimeType): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
