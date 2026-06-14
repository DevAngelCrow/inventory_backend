export class SuccessResponseDto<T> {
  statusCode: number;
  data: T;
  message?: string;
  timestamp: string;

  constructor(data: T, statusCode: number = 200, message?: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
