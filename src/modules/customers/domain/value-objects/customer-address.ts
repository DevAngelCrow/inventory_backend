import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerAddress {
  private readonly _addressLine1: string | undefined;
  private readonly _addressLine2: string | undefined;
  private readonly _city: string | undefined;
  private readonly _state: string | undefined;
  private readonly _zipCode: string | undefined;

  constructor(
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    state?: string,
    zipCode?: string,
  ) {
    if (addressLine1) {
      this._addressLine1 = Validator.of(
        addressLine1,
        (msg) => new InvalidValueObjectException('CustomerAddressLine1', msg),
      )
        .maxLength(255)
        .getValue();
    }

    if (addressLine2) {
      this._addressLine2 = Validator.of(
        addressLine2,
        (msg) => new InvalidValueObjectException('CustomerAddressLine2', msg),
      )
        .maxLength(255)
        .getValue();
    }

    if (city) {
      this._city = Validator.of(
        city,
        (msg) => new InvalidValueObjectException('CustomerCity', msg),
      )
        .maxLength(100)
        .getValue();
    }

    if (state) {
      this._state = Validator.of(
        state,
        (msg) => new InvalidValueObjectException('CustomerState', msg),
      )
        .maxLength(100)
        .getValue();
    }

    if (zipCode) {
      this._zipCode = Validator.of(
        zipCode,
        (msg) => new InvalidValueObjectException('CustomerZipCode', msg),
      )
        .maxLength(20)
        .getValue();
    }
  }

  public get addressLine1(): string | undefined { return this._addressLine1; }
  public get addressLine2(): string | undefined { return this._addressLine2; }
  public get city(): string | undefined { return this._city; }
  public get state(): string | undefined { return this._state; }
  public get zipCode(): string | undefined { return this._zipCode; }
}
