import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class DocumentTypeDescription {
  private readonly _value: string;
  constructor(value: string) {
    const createException = (msg: string): InvalidValueObjectException =>
      new InvalidValueObjectException('document type description', msg);
    this._value = Validator.of(value, createException)
      .required('Document type description is required')
      .string('Document type description must be a string')
      .minLength(
        1,
        'Document type description must be at least 1 character long',
      )
      .maxLength(
        150,
        'Document type description must be at most 150 characters long',
      )
      .getValue();
  }
  public value(): string {
    return this._value;
  }

  public equals(other: DocumentTypeDescription): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
