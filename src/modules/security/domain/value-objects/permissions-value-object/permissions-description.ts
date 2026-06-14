import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class PermissionsDescription {
  private readonly _value: string;

  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('permissions description', msg);

    this._value = Validator.of(value, createException)
      .required('Permissions description is required')
      .string('Permissions description must be a string')
      .minLength(
        2,
        'Permissions description must be at least 2 characters long',
      )
      .maxLength(
        255,
        'Permissions description must be at most 255 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }
  public equals(other: PermissionsDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
