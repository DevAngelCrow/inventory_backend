import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class ReservationAddress {
  private readonly _addressLine1: string | undefined;
  private readonly _addressLine2: string | undefined;
  private readonly _zip: string | undefined;
  private readonly _notes: string | undefined;
  private readonly _idGeographicDivision: string | undefined;
  private readonly _idCustomerAddress: string | undefined;

  constructor(data?: {
    addressLine1?: string;
    addressLine2?: string;
    zip?: string;
    notes?: string;
    idGeographicDivision?: string;
    idCustomerAddress?: string;
  }) {
    if (data?.addressLine1) {
      this._addressLine1 = Validator.of(
        data.addressLine1,
        (msg) => new InvalidValueObjectException('ReservationAddress.addressLine1', msg),
      )
        .maxLength(500, 'Delivery address must not exceed 500 characters')
        .getValue();
    }
    this._addressLine2 = data?.addressLine2;
    this._zip = data?.zip;
    this._notes = data?.notes;
    this._idGeographicDivision = data?.idGeographicDivision;
    this._idCustomerAddress = data?.idCustomerAddress;
  }

  public get addressLine1(): string | undefined { return this._addressLine1; }
  public get addressLine2(): string | undefined { return this._addressLine2; }
  public get zip(): string | undefined { return this._zip; }
  public get notes(): string | undefined { return this._notes; }
  public get idGeographicDivision(): string | undefined { return this._idGeographicDivision; }
  public get idCustomerAddress(): string | undefined { return this._idCustomerAddress; }

  /** @deprecated Use addressLine1 instead */
  public value(): string | undefined {
    return this._addressLine1;
  }
}
