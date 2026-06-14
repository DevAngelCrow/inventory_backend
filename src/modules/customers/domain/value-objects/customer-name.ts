import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerName {
  private readonly _firstName: string;
  private readonly _lastName: string;

  constructor(firstName: string, lastName: string) {
    this._firstName = Validator.of(
      firstName,
      (msg) => new InvalidValueObjectException('CustomerFirstName', msg),
    )
      .required()
      .maxLength(150, 'First name must not exceed 150 characters')
      .getValue();

    this._lastName = Validator.of(
      lastName,
      (msg) => new InvalidValueObjectException('CustomerLastName', msg),
    )
      .required()
      .maxLength(150, 'Last name must not exceed 150 characters')
      .getValue();
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
}
