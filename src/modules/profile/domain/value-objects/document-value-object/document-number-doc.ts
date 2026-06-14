import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class DocumentNumberDoc {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('document number doc', msg);
    this._value = Validator.of(value, createException)
      .required('Document number doc is required')
      .string('Document number doc must be a string')
      .minLength(1, 'Document number doc must be at least 1 character long')
      .maxLength(150, 'Document number doc must be at most 150 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: DocumentNumberDoc): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
