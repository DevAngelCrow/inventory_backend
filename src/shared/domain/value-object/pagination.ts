import { EntityList } from './entity-list';
import { Page } from './page';
import { PerPage } from './per-page';
import { TotalItems } from './total-items';
import { TotalPages } from './total-page';

export class Pagination<T> {
  constructor(
    private readonly entity_list: EntityList<T>,
    private readonly page: Page,
    private readonly per_page: PerPage,
    private readonly total_items: TotalItems,
    private readonly total_pages: TotalPages = new TotalPages(
      Math.ceil(this.total_items.value() / this.per_page.value()),
    ),
  ) {}
  getEntityList(): T[] {
    return this.entity_list.value();
  }
  getPage(): number {
    return this.page.value();
  }
  getPerPage(): number {
    return this.per_page.value();
  }

  getTotalItems(): number {
    return this.total_items.value();
  }
  getTotalPages(): number {
    return this.total_pages.value();
  }
}
