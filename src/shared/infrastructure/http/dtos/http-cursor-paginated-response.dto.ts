export class HttpCursorPaginatedResponseDto<T> {
  data: T[];
  next_cursor: string | null;

  constructor(data: T[], next_cursor: string | null) {
    this.data = data;
    this.next_cursor = next_cursor;
  }
}
