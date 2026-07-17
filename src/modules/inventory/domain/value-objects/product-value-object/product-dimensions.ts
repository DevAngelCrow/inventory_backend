import { InvalidValueObjectException } from 'src/shared/domain/exceptions/invalid-value-object.exception';

export interface DimensionValues {
  width: number;
  height: number;
  depth?: number | null;
  unitId: string;
}

export class ProductDimensions {
  private readonly _value: DimensionValues | null;

  constructor(value?: DimensionValues | null) {
    if (value) {
      if (value.width <= 0) {
        throw new InvalidValueObjectException(
          'ProductDimensions',
          'Width must be greater than zero',
        );
      }
      if (value.height <= 0) {
        throw new InvalidValueObjectException(
          'ProductDimensions',
          'Height must be greater than zero',
        );
      }
      if (value.depth !== undefined && value.depth !== null && value.depth <= 0) {
        throw new InvalidValueObjectException(
          'ProductDimensions',
          'Depth must be greater than zero',
        );
      }
      if (!value.unitId) {
        throw new InvalidValueObjectException(
          'ProductDimensions',
          'Measurement Unit ID is required',
        );
      }
      this._value = value;
    } else {
      this._value = null;
    }
  }

  public value(): DimensionValues | null {
    return this._value;
  }

  public equals(other: ProductDimensions): boolean {
    if (!this._value && !other.value()) return true;
    if (!this._value || !other.value()) return false;
    
    const thisVal = this._value as DimensionValues;
    const otherVal = other.value() as DimensionValues;
    
    return (
      thisVal.width === otherVal.width &&
      thisVal.height === otherVal.height &&
      thisVal.depth === otherVal.depth &&
      thisVal.unitId === otherVal.unitId
    );
  }
}
