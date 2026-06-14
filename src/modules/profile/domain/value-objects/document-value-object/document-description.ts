import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class DocumentDescription {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('document description', msg);
    this._value = Validator.of(value, createException)
      .required('Document description is required')
      .string('Document description must be a string')
      .minLength(1, 'Document description must be at least 1 character long')
      .maxLength(
        150,
        'Document description must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: DocumentDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
