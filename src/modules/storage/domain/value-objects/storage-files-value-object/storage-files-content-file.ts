import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class StorageFilesContentFile<T> {
  private readonly _value: T;
  constructor(value: T) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('storage files content file', msg);
    this._value = Validator.of(value, createException)
      .required('Storage files content file is required')
      .getValue();
  }
  public value(): T {
    return this._value;
  }

  public equals(other: StorageFilesContentFile<T>): boolean {
    return this._value === other._value;
  }

  //   public toString(): string {
  //     return this._value;
  //   }
}
