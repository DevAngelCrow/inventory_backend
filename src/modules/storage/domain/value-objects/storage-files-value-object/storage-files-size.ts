import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class StorageFilesSize {
  private readonly _value: number;

  constructor(value: number) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('storage files size', msg),
    )
      .required('Storage files size is required')
      .positiveInteger('Storage files size must be a positive integer')
      .getValue();
  }

  public value(): number {
    return this._value;
  }

  public equals(other: StorageFilesSize): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
