import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from 'src/shared/domain/validator/validator-value-object';

export class MenuRequiredAuth {
  private readonly _value: boolean;

  constructor(value: boolean) {
    this._value = Validator.of(
      value,
      (msg) => new InvalidValueObjectException('MenuRequiredAuth', msg),
    )
      .boolean('Menu required auth must be a boolean')
      .getValue();
  }

  public value(): boolean {
    return this._value;
  }

  public equals(other: MenuRequiredAuth): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
