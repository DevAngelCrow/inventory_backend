import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class StorageFilesFileName {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('storage files file name', msg);
    this._value = Validator.of(value, createException)
      .required('Storage files file name is required')
      .string('Storage files file name must be a string')
      .minLength(1, 'Storage files file name must be at least 1 character long')
      .maxLength(
        150,
        'Storage files file name must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: StorageFilesFileName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
