export class ErrorResponseDto {
  statusCode: number;
  errorCode?: string;
  message: string;
  code: string;
  type: string;
  timestamp: string;
  path?: string;
  stack?: string;
  originalError?: {
    name: string;
    message: string;
  };

  constructor(
    statusCode: number,
    message: string,
    code: string,
    type: string,
    path?: string,
    errorCode?: string,
  ) {
    this.statusCode = statusCode;
    if (errorCode) this.errorCode = errorCode;
    this.message = message;
    this.code = code;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
