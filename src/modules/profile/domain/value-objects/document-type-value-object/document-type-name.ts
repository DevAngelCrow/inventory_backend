import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class DocumentTypeName {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('document type name', msg);
    this._value = Validator.of(value, createException)
      .required('Document type name is required')
      .string('Document type name must be a string')
      .minLength(1, 'Document type name must be at least 1 character long')
      .maxLength(150, 'Document type name must be at most 150 characters long')
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: DocumentTypeName): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
