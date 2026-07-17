import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';
import { randomUUID } from 'crypto';

export class MeasurementUnitId {
  private readonly _value: string;

  constructor(value?: string) {
    const val = value ?? randomUUID();
    Validator.of(
      val,
      (msg) => new InvalidValueObjectException('MeasurementUnitId', msg),
    )
      .uuid('Measurement unit ID must be a valid UUID')
      .getValue();
    this._value = val;
  }

  public value(): string {
    return this._value;
  }

  public equals(other: MeasurementUnitId): boolean {
    return this._value === other.value();
  }
}
