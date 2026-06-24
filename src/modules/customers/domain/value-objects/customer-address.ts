import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerAddress {
  private readonly _id: string | undefined;
  private readonly _label: string;
  private readonly _addressLine1: string;
  private readonly _addressLine2: string | undefined;
  private readonly _zipCode: string | undefined;
  private readonly _isPrimary: boolean;
  private readonly _idGeographicDivision: string | undefined;
  private readonly _active: boolean;

  constructor(
    label: string,
    addressLine1: string,
    isPrimary: boolean,
    addressLine2?: string,
    zipCode?: string,
    idGeographicDivision?: string,
    id?: string,
    active?: boolean,
  ) {
    this._label = Validator.of(
      label,
      (msg) => new InvalidValueObjectException('CustomerAddressLabel', msg),
    )
      .required()
      .maxLength(50)
      .getValue();

    this._addressLine1 = Validator.of(
      addressLine1,
      (msg) => new InvalidValueObjectException('CustomerAddressLine1', msg),
    )
      .required()
      .maxLength(255)
      .getValue();

    this._isPrimary = isPrimary;

    if (addressLine2) {
      this._addressLine2 = Validator.of(
        addressLine2,
        (msg) => new InvalidValueObjectException('CustomerAddressLine2', msg),
      )
        .maxLength(255)
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

    this._idGeographicDivision = idGeographicDivision;
    this._id = id;
    this._active = active ?? true;
  }

  public get id(): string | undefined {
    return this._id;
  }
  public get label(): string {
    return this._label;
  }
  public get addressLine1(): string {
    return this._addressLine1;
  }
  public get addressLine2(): string | undefined {
    return this._addressLine2;
  }
  public get zipCode(): string | undefined {
    return this._zipCode;
  }
  public get isPrimary(): boolean {
    return this._isPrimary;
  }
  public get idGeographicDivision(): string | undefined {
    return this._idGeographicDivision;
  }
  public get active(): boolean {
    return this._active;
  }
}
