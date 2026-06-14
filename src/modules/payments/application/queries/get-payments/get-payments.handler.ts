import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaymentsQuery } from './get-payments.query';
import { PaymentQueriesRepository } from '@/modules/payments/application/repositories/payment-read.repository';
import { PaymentDto } from '@/modules/payments/application/dtos/payment.dto';
import { Pagination } from '@/shared/domain/value-object/pagination';
import { PaginationParams } from '@/shared/domain/value-object/pagination-params';

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsHandler implements IQueryHandler<GetPaymentsQuery> {
  constructor(private readonly repository: PaymentQueriesRepository) {}

  async execute(
    query: GetPaymentsQuery,
  ): Promise<Pagination<PaymentDto> | PaymentDto[]> {
    if (query.pagination_params) {
      const paginationParams = PaginationParams.create({
        ...query.pagination_params,
      });
      return await this.repository.getAll(
        paginationParams,
        query.filter_reservation,
        query.filter_status,
      );
    }
    return await this.repository.getAll(
      undefined,
      query.filter_reservation,
      query.filter_status,
    );
  }
}
