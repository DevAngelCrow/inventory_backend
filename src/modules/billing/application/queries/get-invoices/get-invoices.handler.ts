import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInvoicesQuery } from './get-invoices.query';
import { InvoiceQueriesRepository } from '@/modules/billing/application/repositories/invoice-read.repository';
import { InvoiceDto } from '@/modules/billing/application/dtos/invoice.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetInvoicesQuery)
export class GetInvoicesHandler implements IQueryHandler<GetInvoicesQuery> {
  constructor(private readonly repository: InvoiceQueriesRepository) {}

  async execute(
    query: GetInvoicesQuery,
  ): Promise<Pagination<InvoiceDto> | InvoiceDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter_reservation,
        query.filter_customer,
        query.filter_status,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter_reservation,
      query.filter_customer,
      query.filter_status,
    );
  }
}
