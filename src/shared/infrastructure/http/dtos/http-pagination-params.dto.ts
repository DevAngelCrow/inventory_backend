import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

export class PaginationHttpParamsDto {
  constructor(
    public readonly page: number,
    public readonly per_page: number,
  ) {}
  static fromDomain(pagination: PaginationParams): PaginationHttpParamsDto {
    return new PaginationHttpParamsDto(
      pagination.getPage().value(),
      pagination.getPerPage().value(),
    );
  }
}
