export class ApplicationException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly errorCode?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
