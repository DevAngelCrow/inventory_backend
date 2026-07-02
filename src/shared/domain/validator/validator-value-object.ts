import { DomainException } from '../exceptions/domain.exception';

type DomainExceptionConstructor = new (message: string) => DomainException;
type DomainExceptionFactory = (message: string) => DomainException;

export class Validator<T> {
  private constructor(
    private readonly value: T,
    private readonly exceptionFactory: DomainExceptionFactory,
  ) {}

  static of<T>(
    value: T,
    exceptionFactory: DomainExceptionConstructor | DomainExceptionFactory,
  ): Validator<T> {
    const isConstructor = (
      fn: DomainExceptionConstructor | DomainExceptionFactory,
    ): fn is DomainExceptionConstructor => {
      return typeof fn === 'function' && fn.prototype !== undefined;
    };

    const factory = isConstructor(exceptionFactory)
      ? (msg: string) => new exceptionFactory(msg)
      : exceptionFactory;

    return new Validator(value, factory);
  }

  required(message: string = 'Field is required'): this {
    if (
      this.value === null ||
      this.value === undefined ||
      this.value === '' ||
      (Array.isArray(this.value) && this.value.length === 0)
    ) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  email(message: string = 'Invalid email format'): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(this.value))) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  number(message: string = 'Invalid number format'): this {
    if (typeof this.value !== 'number' || Number.isNaN(this.value)) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  positiveInteger(message: string = 'Must be a positive integer'): this {
    if (
      typeof this.value !== 'number' ||
      !Number.isInteger(this.value) ||
      this.value <= 0
    ) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  string(message: string = 'Must be a string'): this {
    if (typeof this.value !== 'string') {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  uuid(message: string = 'Invalid UUID format'): this {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(String(this.value))) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  ip(message: string = 'Invalid IP address format'): this {
    const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^(?:[\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;

    const strValue = String(this.value);
    if (!ipv4Regex.test(strValue) && !ipv6Regex.test(strValue)) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  minLength(length: number, message?: string): this {
    const strValue = String(this.value);
    if (strValue.length < length) {
      throw this.exceptionFactory(
        message || `Minimum length is ${length} characters`,
      );
    }

    return this;
  }

  maxLength(length: number, message?: string): this {
    const strValue = String(this.value);
    if (strValue.length > length) {
      throw this.exceptionFactory(
        message || `Maximum length is ${length} characters`,
      );
    }

    return this;
  }

  min(min: number, message?: string): this {
    if (typeof this.value !== 'number' || this.value < min) {
      throw this.exceptionFactory(message || `Value must be at least ${min}`);
    }

    return this;
  }

  max(max: number, message?: string): this {
    if (typeof this.value !== 'number' || this.value > max) {
      throw this.exceptionFactory(message || `Value must not exceed ${max}`);
    }

    return this;
  }

  range(min: number, max: number, message?: string): this {
    if (
      typeof this.value !== 'number' ||
      this.value < min ||
      this.value > max
    ) {
      throw this.exceptionFactory(
        message || `Value must be between ${min} and ${max}`,
      );
    }

    return this;
  }

  pattern(regex: RegExp, message: string = 'Invalid format'): this {
    if (!regex.test(String(this.value))) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  boolean(message: string = 'Must be a boolean'): this {
    if (typeof this.value !== 'boolean') {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  array(message: string = 'Must be an array'): this {
    if (!Array.isArray(this.value)) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  date(message: string = 'Invalid date format'): this {
    if (
      this.value instanceof Date ||
      typeof this.value === 'string' ||
      typeof this.value === 'number'
    ) {
      const date = new Date(this.value);
      if (Number.isNaN(date.getTime())) {
        throw this.exceptionFactory(message);
      }
    } else {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  url(message: string = 'Invalid URL format'): this {
    try {
      new URL(String(this.value));
    } catch {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  custom(
    predicate: (value: T) => boolean,
    message: string = 'Validation failed',
  ): this {
    if (!predicate(this.value)) {
      throw this.exceptionFactory(message);
    }

    return this;
  }

  getValue(): T {
    return this.value;
  }
}
