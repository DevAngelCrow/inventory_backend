export class HttpPaginatedResponseDto<T> {
  data: T[];
  total_page: number;
  current_page: number;
  per_page: number;
  total_items: number;

  constructor(
    data: T[],
    total_items: number,
    total_page: number,
    current_page: number,
    per_page: number,
  ) {
    this.data = data;
    this.current_page = current_page;
    this.per_page = per_page;
    this.total_items = total_items;
    this.total_page = total_page;
  }
}
