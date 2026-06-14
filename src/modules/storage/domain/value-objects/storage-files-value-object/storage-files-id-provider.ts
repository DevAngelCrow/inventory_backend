import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class StorageFilesIdProvider {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) =>
        new InvalidValueObjectException('storage files id provider', msg),
    )
      .required('Storage files id provider is required')
      .uuid('Storage files id provider Must be a valid UUID')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: StorageFilesIdProvider): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
