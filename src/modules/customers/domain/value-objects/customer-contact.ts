import { InvalidValueObjectException } from '@/shared/domain/exceptions/invalid-value-object.exception';
import { Validator } from '@/shared/domain/validator/validator-value-object';

export class CustomerContact {
  private readonly _email: string | undefined;
  private readonly _phone: string;
  private readonly _phoneSecondary: string | undefined;

  constructor(phone: string, email?: string, phoneSecondary?: string) {
    this._phone = Validator.of(
      phone,
      (msg) => new InvalidValueObjectException('CustomerPhone', msg),
    )
      .required()
      .maxLength(20)
      .getValue();

    if (email) {
      this._email = Validator.of(
        email,
        (msg) => new InvalidValueObjectException('CustomerEmail', msg),
      )
        .email()
        .maxLength(150)
        .getValue();
    } else {
      this._email = undefined;
    }

    if (phoneSecondary) {
      this._phoneSecondary = Validator.of(
        phoneSecondary,
        (msg) => new InvalidValueObjectException('CustomerPhoneSecondary', msg),
      )
        .maxLength(20)
        .getValue();
    } else {
      this._phoneSecondary = undefined;
    }
  }

  public get phone(): string {
    return this._phone;
  }

  public get email(): string | undefined {
    return this._email;
  }

  public get phoneSecondary(): string | undefined {
    return this._phoneSecondary;
  }
}
