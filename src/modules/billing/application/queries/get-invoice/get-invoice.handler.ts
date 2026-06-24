import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInvoiceQuery } from './get-invoice.query';
import { InvoiceQueriesRepository } from '../../repositories/invoice-read.repository';
import { InvoiceDto } from '../../dtos/invoice.dto';

@QueryHandler(GetInvoiceQuery)
export class GetInvoiceHandler implements IQueryHandler<
  GetInvoiceQuery,
  InvoiceDto | null
> {
  constructor(private readonly repository: InvoiceQueriesRepository) {}

  async execute(query: GetInvoiceQuery): Promise<InvoiceDto | null> {
    return await this.repository.findById(query.id);
  }
}
