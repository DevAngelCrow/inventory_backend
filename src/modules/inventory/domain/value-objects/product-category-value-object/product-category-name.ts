import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class ProductCategoryName {
  private readonly _value: string;

  constructor(value: string) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('ProductCategoryName', msg),
    )
      .required('Product category name is required')
      .maxLength(150, 'Product category name must not exceed 150 characters')
      .getValue();
  }

  public value(): string {
    return this._value;
  }

  public equals(other: ProductCategoryName): boolean {
    return this._value === other._value;
  }
}
