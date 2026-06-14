export class HttpGenericResponseDto<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
  }
}
