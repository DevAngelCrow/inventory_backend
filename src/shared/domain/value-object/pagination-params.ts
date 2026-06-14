import { Page } from './page';
import { PerPage } from './per-page';

export class PaginationParams {
  constructor(
    private readonly page: Page,
    private readonly per_page: PerPage,
  ) {}
  public static create(data: {
    page: number;
    per_page: number;
  }): PaginationParams {
    return new PaginationParams(
      new Page(data.page),
      new PerPage(data.per_page),
    );
  }
  getPage(): Page {
    return this.page;
  }
  getPerPage(): PerPage {
    return this.per_page;
  }
}
